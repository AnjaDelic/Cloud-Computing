FROM golang:latest

WORKDIR /app/gradskaBibliotekaNS

COPY ./backend/gradskaBibliotekaNS/go.mod ./backend/gradskaBibliotekaNS/go.sum ./

RUN go mod download

COPY ./backend/gradskaBibliotekaNS/ .

RUN go build -o gradskaBibliotekaNS

EXPOSE 8081

CMD ["./gradskaBibliotekaNS"]
