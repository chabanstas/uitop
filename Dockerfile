FROM node:24-alpine

RUN apk upgrade --no-cache

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "test:api"]
