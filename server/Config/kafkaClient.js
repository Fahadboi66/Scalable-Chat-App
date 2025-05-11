import kafka from "kafka-node";



// Initializing Kafka Client
const kafkaClient = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKERS  });
const producer = new kafka.Producer(kafkaClient);

// Setup Event Listeners
producer.on('ready', () => console.log("Kafka Producer Ready"));
producer.on('error', (err) => console.log("Kafka Producer Error: ", err));

export { producer };