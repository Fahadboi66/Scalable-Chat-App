import Redis from 'redis';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

//Initialize Redis Client
const redisClient = Redis.createClient({url: REDIS_URL});
const redisPubSub = Redis.createClient({url: REDIS_URL});

//Redis Error Handling
redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisPubSub.on('error', (err) => console.error('Redis Pub/Sub Error:', err));

async function connectRedis() {
    await redisClient.connect();
    await redisPubSub.connect();
}

connectRedis();


export { redisClient, redisPubSub };