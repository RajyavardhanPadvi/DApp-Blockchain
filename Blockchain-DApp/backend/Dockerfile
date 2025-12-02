FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache bash

COPY package.json ./
RUN npm install

COPY . .

RUN chmod +x wait-for-it.sh

EXPOSE 5000

CMD ["./wait-for-it.sh", "blockchain", "8545", "--", "node", "server.js"]
