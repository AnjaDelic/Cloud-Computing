// centralnaBiblioteka.go

package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var centralDB *mongo.Database

type Member struct {
	ID         string `json:"id" bson:"_id"`
	LoansCount int    `json:"loansCount" bson:"loansCount"`
	FirstName  string `json:"firstName" bson:"firstName"`
	LastName   string `json:"lastName" bson:"lastName"`
	Address    string `json:"address" bson:"address"`
	JMBG       string `json:"jmbg" bson:"jmbg"`
}

func init() {
	// Inicijalizacija povezivanja sa bazom podataka centralne biblioteke
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	centralDB = client.Database("centralna_biblioteka")
}

func registerMember(w http.ResponseWriter, r *http.Request) {
	var newMember Member
	err := json.NewDecoder(r.Body).Decode(&newMember)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Provera da li član već postoji u BP centralne biblioteke
	var existingMember Member
	err = centralDB.Collection("members").FindOne(context.Background(), bson.M{"jmbg": newMember.JMBG}).Decode(&existingMember)

	switch {
	case err == mongo.ErrNoDocuments:
		// Član ne postoji, upisujem ga u BP centralne biblioteke
		// Generisanje UUID-ja i postavljanje kao ID
		newMember.ID = uuid.New().String()

		_, err = centralDB.Collection("members").InsertOne(context.Background(), newMember)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Slanje odgovora o uspešnoj registraciji
		response := map[string]interface{}{"status": "success", "memberID": newMember.ID}
		json.NewEncoder(w).Encode(response)

	case err != nil:
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return

	default:
		// Član već postoji, šaljem odgovor o neuspešnoj registraciji
		response := map[string]interface{}{"status": "failure", "message": "Član već postoji"}
		json.NewEncoder(w).Encode(response)
	}
}

func getAllMembers(w http.ResponseWriter, r *http.Request) {
	cursor, err := centralDB.Collection("members").Find(context.Background(), bson.M{})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var members []Member
	for cursor.Next(context.Background()) {
		var member Member
		if err := cursor.Decode(&member); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		members = append(members, member)
	}

	json.NewEncoder(w).Encode(members)
}
func main() {

	r := mux.NewRouter()

	r.HandleFunc("/register", registerMember).Methods("POST")
	r.HandleFunc("/members", getAllMembers).Methods("GET")

	// Allow CORS
	headersOk := handlers.AllowedHeaders([]string{"Content-Type", "Authorization"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	// Start the server with CORS middleware
	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(headersOk, originsOk, methodsOk)(r)))
}
