import Redis from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';
const redisClient = Redis.createClient({ url: REDIS_URL });
redisClient.on('error', (err) => console.error('Redis Client Error:', err));

async function connectRedis() {
  await redisClient.connect();
}

connectRedis();

export const getSockets = async (members = []) => {
  const sockets = [];
  for (const user of members) {
    const userData = await redisClient.get(`user:${user.toString()}`);
    if (userData) {
      const { socketId } = JSON.parse(userData);
      if (socketId) sockets.push(socketId);
    }
  }
  return sockets;
};