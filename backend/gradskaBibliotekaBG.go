// gradskaBibliotekaBG.go

package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var cityDB *mongo.Database
var centralDB *mongo.Database

type BookLoan struct {
	ID           string    `json:"id" bson:"_id"`
	BookTitle    string    `json:"bookTitle" bson:"bookTitle"`
	Author       string    `json:"author" bson:"author"`
	ISBN         string    `json:"isbn" bson:"isbn"`
	LoanDate     time.Time `json:"loanDate" bson:"loanDate"`
	MemberNumber string    `json:"memberNumber" bson:"memberNumber"`
}

type AvailableBook struct {
	BookTitle      string `json:"bookTitle" bson:"bookTitle"`
	Author         string `json:"author" bson:"author"`
	ISBN           string `json:"isbn" bson:"isbn"`
	AvailableCount int    `json:"availableCount" bson:"availableCount"`
	TotalCount     int    `json:"totalCount" bson:"totalCount"`
}

type Member struct {
	ID         string `json:"id" bson:"_id"`
	LoansCount int    `json:"loansCount" bson:"loansCount"`
	FirstName  string `json:"firstName" bson:"firstName"`
	LastName   string `json:"lastName" bson:"lastName"`
	Address    string `json:"address" bson:"address"`
	JMBG       string `json:"jmbg" bson:"jmbg"`
}

func init() {
	// Inicijalizacija povezivanja sa bazom podataka grada
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal("Failed to connect to city database:", err)
	}

	cityDB = client.Database("biblioteka_gradaBG")

	// Inicijalizacija povezivanja sa centralnom bazom
	centralClient, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal("Failed to connect to central database:", err)
	}

	centralDB = centralClient.Database("centralna_biblioteka")
}

func borrowBook(w http.ResponseWriter, r *http.Request) {
	var newBookLoan BookLoan
	err := json.NewDecoder(r.Body).Decode(&newBookLoan)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Provera da li član sa datim memberNumber postoji u centralnoj biblioteci
	var member Member
	err = centralDB.Collection("members").FindOne(context.Background(), bson.M{"_id": newBookLoan.MemberNumber}).Decode(&member)
	if err == mongo.ErrNoDocuments {
		// Član ne postoji, šaljem odgovor o neuspešnom zaduživanju
		response := map[string]interface{}{"status": "failure", "message": "Član ne postoji"}
		json.NewEncoder(w).Encode(response)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Provera da li knjiga postoji u available_books
	var availableBook AvailableBook
	err = cityDB.Collection("available_books").FindOne(context.Background(), bson.M{
		"bookTitle": newBookLoan.BookTitle,
		"author":    newBookLoan.Author,
		"isbn":      newBookLoan.ISBN,
	}).Decode(&availableBook)
	if err == mongo.ErrNoDocuments || availableBook.AvailableCount == 0 {
		// Knjiga ne postoji ili nema raspoloživih kopija, šaljem odgovor o neuspešnom zaduživanju
		response := map[string]interface{}{"status": "failure", "message": "Knjiga nije dostupna"}
		json.NewEncoder(w).Encode(response)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Generisanje UUID identifikatora za zaduživanje knjige
	newBookLoan.ID = uuid.New().String()

	// Provera maksimalnog broja knjiga koje član može zadužiti
	if member.LoansCount < 3 {
		// Član može da zaduži knjigu, povećavam broj zaduženja
		member.LoansCount++

		// Smanjujem broj raspoloživih kopija knjige
		availableBook.AvailableCount--

		// Upisivanje informacija o članu u centralnu bazu
		_, err := centralDB.Collection("members").UpdateOne(context.Background(),
			bson.M{"_id": newBookLoan.MemberNumber},
			bson.M{"$set": bson.M{"loansCount": member.LoansCount}},
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Upisivanje informacija o zaduživanju u bazu biblioteke grada
		newBookLoan.LoanDate = time.Now()
		_, err = cityDB.Collection("book_loans").InsertOne(context.Background(), newBookLoan)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Upisivanje informacija u bazu biblioteke grada
		_, err = cityDB.Collection("available_books").UpdateOne(context.Background(),
			bson.M{
				"bookTitle": newBookLoan.BookTitle,
				"author":    newBookLoan.Author,
				"isbn":      newBookLoan.ISBN,
			},
			bson.M{"$set": bson.M{"availableCount": availableBook.AvailableCount}},
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Slanje odgovora o uspešnom zaduživanju
		response := map[string]interface{}{"status": "success", "loanID": newBookLoan.ID}
		json.NewEncoder(w).Encode(response)
	} else {
		// Član je već zadužio maksimalan broj knjiga, šaljem odgovor o neuspešnom zaduživanju
		response := map[string]interface{}{"status": "failure", "message": "Član je već zadužio maksimalan broj knjiga"}
		json.NewEncoder(w).Encode(response)
	}
}

func addBook(w http.ResponseWriter, r *http.Request) {
	var newAvailableBook AvailableBook
	err := json.NewDecoder(r.Body).Decode(&newAvailableBook)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Dodavanje knjige u bazu biblioteke grada
	_, err = cityDB.Collection("available_books").InsertOne(context.Background(), newAvailableBook)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Slanje odgovora o uspešnom dodavanju knjige
	response := map[string]interface{}{"status": "success"}
	json.NewEncoder(w).Encode(response)
}

func returnBook(w http.ResponseWriter, r *http.Request) {
	var returnedBook BookLoan
	err := json.NewDecoder(r.Body).Decode(&returnedBook)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Provera da li član sa datim memberNumber postoji u centralnoj biblioteci
	var member Member
	err = centralDB.Collection("members").FindOne(context.Background(), bson.M{"_id": returnedBook.MemberNumber}).Decode(&member)
	if err == mongo.ErrNoDocuments {
		// Član ne postoji, šaljem odgovor o neuspešnom vraćanju knjige
		response := map[string]interface{}{"status": "failure", "message": "Član ne postoji"}
		json.NewEncoder(w).Encode(response)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Provera da li knjiga postoji u book_loans
	var loanedBook BookLoan
	err = cityDB.Collection("book_loans").FindOne(context.Background(), bson.M{
		"bookTitle":    returnedBook.BookTitle,
		"author":       returnedBook.Author,
		"isbn":         returnedBook.ISBN,
		"memberNumber": returnedBook.MemberNumber,
	}).Decode(&loanedBook)
	if err == mongo.ErrNoDocuments {
		// Pozajmica ne postoji, šaljem odgovor o neuspešnom vraćanju knjige
		response := map[string]interface{}{"status": "failure", "message": "Knjiga nije pozajmljena ovom članu"}
		json.NewEncoder(w).Encode(response)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Ažuriranje broja pozajmljenih knjiga kod člana
	if member.LoansCount > 0 {
		member.LoansCount--

		// Ažuriranje broja dostupnih kopija knjige
		_, err := centralDB.Collection("members").UpdateOne(context.Background(),
			bson.M{"_id": returnedBook.MemberNumber},
			bson.M{"$set": bson.M{"loansCount": member.LoansCount}},
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Brisanje pozajmice iz baze podataka
		_, err = cityDB.Collection("book_loans").DeleteOne(context.Background(),
			bson.M{"_id": loanedBook.ID},
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Ažuriranje broja dostupnih kopija knjige
		_, err = cityDB.Collection("available_books").UpdateOne(context.Background(),
			bson.M{
				"bookTitle": returnedBook.BookTitle,
				"author":    returnedBook.Author,
				"isbn":      returnedBook.ISBN,
			},
			bson.M{"$inc": bson.M{"availableCount": 1}},
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Slanje odgovora o uspešnom vraćanju knjige
		response := map[string]interface{}{"status": "success"}
		json.NewEncoder(w).Encode(response)
	} else {
		// Greška ako član nije imao nijednu pozajmicu
		response := map[string]interface{}{"status": "failure", "message": "Član nema pozajmljenih knjiga"}
		json.NewEncoder(w).Encode(response)
	}
}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/borrow", borrowBook).Methods("POST")
	r.HandleFunc("/addBook", addBook).Methods("POST")
	r.HandleFunc("/returnBook", returnBook).Methods("POST")

	// Allow CORS
	headersOk := handlers.AllowedHeaders([]string{"Content-Type", "Authorization"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	// Start the server with CORS middleware
	log.Fatal(http.ListenAndServe(":8082", handlers.CORS(headersOk, originsOk, methodsOk)(r)))
}
