import { consumer } from '../config/kafkaClient.js';
import { connectMongo } from '../config/mongoClient.js';

let messageBuffer = [];
const BATCH_SIZE = 100;
const BATCH_INTERVAL = 5000; // 5 seconds

export async function startPersistenceService() {
  const db = await connectMongo();

  async function saveBatch() {
    if (messageBuffer.length === 0) return;
    try {
      await db.collection('messages').insertMany(messageBuffer);
      console.log(`Saved ${messageBuffer.length} messages to MongoDB`);
      messageBuffer = [];
    } catch (err) {
      console.error('MongoDB Batch Save Error:', err);
    }
  }

  // Consume messages
  consumer.on('message', (message) => {
    const msg = JSON.parse(message.value);
    messageBuffer.push({
      chat: msg.chat,
      sender: msg.sender,
      content: msg.content,
      attachments: msg.attachments,
      createdAt: new Date(msg.createdAt),
    });
    if (messageBuffer.length >= BATCH_SIZE) {
      saveBatch();
    }
  });

  // Periodic batch saving
  setInterval(saveBatch, BATCH_INTERVAL);
}