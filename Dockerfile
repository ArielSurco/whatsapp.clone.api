FROM node:21.6.2-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npx tsc

CMD [ "node", "dist/index.js" ]

EXPOSE 8080