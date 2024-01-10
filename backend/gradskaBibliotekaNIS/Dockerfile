FROM golang:latest

WORKDIR /app/gradskaBibliotekaNIS

COPY ./backend/gradskaBibliotekaNIS/go.mod ./backend/gradskaBibliotekaNIS/go.sum ./

RUN go mod download

COPY ./backend/gradskaBibliotekaNIS/ .

RUN go build -o gradskaBibliotekaNIS

EXPOSE 8083

CMD ["./gradskaBibliotekaNIS"]
