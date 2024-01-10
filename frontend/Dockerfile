
FROM node:14

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install

COPY ./frontend/ .

EXPOSE 3000

CMD ["npm", "start"]
