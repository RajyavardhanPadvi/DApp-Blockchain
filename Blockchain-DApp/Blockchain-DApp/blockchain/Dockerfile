FROM node:18-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache python3 make g++ bash

COPY package.json ./
RUN npm install

COPY . .

RUN chmod +x start.sh

EXPOSE 8545

CMD ["./start.sh"]

