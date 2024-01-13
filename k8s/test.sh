#!/bin/bash

# CENTRALNA BIBLIOTEKA

# URL koji će koristiti zahtevi
BASE_URL="http://127.0.0.1:58418"

# REG KORISNIKA
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "firstName": "Sarah",
  "lastName": "Doeeee",
  "address": "123 Main Street",
  "jmbg": "1233568792123"
}' \
  "${BASE_URL}/register"  

sleep 1 
# VEC REG KORISNIK
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "firstName": "Sarah",
  "lastName": "Doeeee",
  "address": "123 Main Street",
  "jmbg": "1233568792123"
}' \
  "${BASE_URL}/register" 

sleep 1
# KORISNIK ISTI JMBG

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "firstName": "John",
  "lastName": "Doe",
  "address": "123 Main Street",
  "jmbg": "1233568792123"
}' \
  "${BASE_URL}/register" 

# KORISNIK 
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "firstName": "John",
  "lastName": "Doe",
  "address": "123 Main Street",
  "jmbg": "1233568992123"
}' \
  "${BASE_URL}/register" 

sleep 2

#SVI korisnici
curl -X GET \
  -H "Content-Type: application/json" \
  "${BASE_URL}/members"  


# BIBLIOTEKA NS

# URL koji će koristiti zahtevi
BASE_URL2="http://127.0.0.1:58411"

# DODAVANJE KNJIGE
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "bookTitle": "nova",
  "author": "nova",
  "isbn": "1",
  "availableCount": 10,
  "totalCount": 10
}' \
  "http://127.0.0.1:58085/addBook"  
sleep 1
# POZAJMLJIVANJE KNJIGE
curl -X POST \
  -d '{
  "bookTitle": "nova",
  "author": "nova",
  "isbn": "1",
  "loanDate": "2022-01-09T12:34:56Z",
  "memberNumber": "c8e94a62-4f47-4bde-bd18-9df243e93cd0"
}' \
  "${BASE_URL}/borrowBook"  

sleep 1
curl -X POST \
  -d '{
  "bookTitle": "nova",
  "author": "nova",
  "isbn": "1",
  "loanDate": "2022-01-09T12:34:56Z",
  "memberNumber": "c8e94a62-4f47-4bde-bd18-9df243e93cd0"
}' \
  "${BASE_URL}/borrowBook" 

sleep 1
curl -X POST \
  -d '{
  "bookTitle": "nova",
  "author": "nova",
  "isbn": "1",
  "loanDate": "2022-01-09T12:34:56Z",
  "memberNumber": "c8e94a62-4f47-4bde-bd18-9df243e93cd0"
}' \
  "${BASE_URL}/borrowBook" 

sleep 1
curl -X POST \
  -d '{
  "bookTitle": "nova",
  "author": "nova",
  "isbn": "1",
  "loanDate": "2022-01-09T12:34:56Z",
  "memberNumber": "c8e94a62-4f47-4bde-bd18-9df243e93cd0"
}' \
  "${BASE_URL}/borrowBook" 

#VRACANJE KNJIGE
sleep 1
curl -X POST \
  -d '{
  "bookTitle": "nova",
  "author": "nova",
  "isbn": "1",
  "loanDate": "2022-01-09T12:34:56Z",
  "memberNumber": "c8e94a62-4f47-4bde-bd18-9df243e93cd0"
}' \
  "${BASE_URL}/returnBook" 
sleep 1
curl -X POST \
  -d '{
  "bookTitle": "nova",
  "author": "nova",
  "isbn": "1",
  "loanDate": "2022-01-09T12:34:56Z",
  "memberNumber": "c8e94a62-4f47-4bde-bd18-9df243e93cd0"
}' \
  "${BASE_URL}/borrowBook" 

curl -X GET \
  -H "Content-Type: application/json" \
  "http://127.0.0.1:58418/members"