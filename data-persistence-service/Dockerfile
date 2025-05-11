FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install kafka-node mongodb dotenv
COPY . .
CMD ["node", "persistence.js"]