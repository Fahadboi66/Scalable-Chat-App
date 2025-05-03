import { Kafka } from "kafka-node";

const KAFKA_BROKERS = process.env.KAFKA_BROKERS || 'kafka:9092';

// Initializing Kafka Client
const kafkaClient = new Kafka.kafkaClient({ kafkaHost: KAFKA_BROKERS });
const producer = new Kafka.Producer(kafkaClient);

// Setup Event Listeners
producer.on('ready', () => console.log("Kafka Producer Ready"));
producer.on('error', (err) => console.log("Kafka Producer Error: ", err));

export { producer };