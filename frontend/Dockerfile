FROM node:16

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install -g react-scripts


RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
