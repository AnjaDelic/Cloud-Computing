
FROM node:14

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install

COPY ./frontend/ .

RUN npm run build

CMD ["npm", "start"]
