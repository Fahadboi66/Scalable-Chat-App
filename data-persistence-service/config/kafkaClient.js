import { Kafka } from 'kafka-node';

const KAFKA_BROKERS = process.env.KAFKA_BROKERS || 'kafka:9092';

const kafkaClient = new Kafka.KafkaClient({ kafkaHost: KAFKA_BROKERS });
const consumer = new Kafka.Consumer(
  kafkaClient,
  [{ topic: 'chat-messages', partition: 0 }],
  { groupId: 'persistence-service', autoCommit: true }
);

consumer.on('error', (err) => console.error('Kafka Consumer Error:', err));

export { consumer };