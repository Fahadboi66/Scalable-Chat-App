import { MongoClient } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/chat-app';

const mongoClient = new MongoClient(MONGO_URL);

async function connectMongo() {
  await mongoClient.connect();
  const db = mongoClient.db('chat_app');
  console.log('Connected to MongoDB');
  return db;
}

export { connectMongo };