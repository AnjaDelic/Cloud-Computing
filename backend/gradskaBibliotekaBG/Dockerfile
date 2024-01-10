FROM golang:latest

WORKDIR /app/gradskaBibliotekaBG

COPY ./backend/gradskaBibliotekaBG/go.mod ./backend/gradskaBibliotekaBG/go.sum ./

RUN go mod download

COPY ./backend/gradskaBibliotekaBG/ .

RUN go build -o gradskaBibliotekaBG

EXPOSE 8082

CMD ["./gradskaBibliotekaBG"]
