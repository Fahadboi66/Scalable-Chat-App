import kafka from 'kafka-node';
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.KAFKA_BROKERS);
const kafkaClient = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKERS || "localhost:9092" });
const consumer = new kafka.Consumer(
  kafkaClient,
  [{ topic: 'chat-messages', partition: 0 }],
  { groupId: 'persistence-service', autoCommit: true }
);

consumer.on('error', (err) => console.error('Kafka Consumer Error:', err));

export { consumer };
