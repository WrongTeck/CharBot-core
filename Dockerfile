# syntax=docker/dockerfile:1
FROM node:16.9.0

ENV NODE_ENV production
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
CMD [ "node", "."]
