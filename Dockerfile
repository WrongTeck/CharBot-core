# syntax=docker/dockerfile:1
FROM alpine:latest
RUN apk add --no-cache nodejs
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY * .
CMD ["npm", "start"]