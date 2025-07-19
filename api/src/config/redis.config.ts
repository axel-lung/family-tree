import { createClient } from 'redis';

export const redisClient = createClient({
  url: process.env.REDIS_URL ||'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis connected'));

// Vérifier si le client est déjà connecté avant de tenter une connexion
export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}