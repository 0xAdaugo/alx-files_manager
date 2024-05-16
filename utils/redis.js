import { createClient } from 'redis';
import { promisify } from 'util';

// Define a class for Redis operations
class MyRedisClient {
  constructor() {
    // Establish connection to Redis
    this.redisConnection = createClient();
    // Error handling for Redis connection
    this.redisConnection.on('error', (err) => {
      console.log(`Error connecting to Redis: ${err}`);
    });
  }

  // Check if Redis connection is alive
  isRedisAlive() {
    if (this.redisConnection.connected) {
      return true;
    }
    return false;
  }

  // Retrieve value from Redis for a given key
  async getFromRedis(key) {
    const redisGetAsync = promisify(this.redisConnection.get).bind(this.redisConnection);
    const value = await redisGetAsync(key);
    return value;
  }

  // Store key-value pair in Redis with expiration time
  async setInRedis(key, value, expiration) {
    const redisSetAsync = promisify(this.redisConnection.set).bind(this.redisConnection);
    await redisSetAsync(key, value);
    await this.redisConnection.expire(key, expiration);
  }

  // Remove key-value pair from Redis
  async deleteFromRedis(key) {
    const redisDelAsync = promisify(this.redisConnection.del).bind(this.redisConnection);
    await redisDelAsync(key);
  }
}

// Create an instance of the Redis client
const myRedisClient = new MyRedisClient();

// Export the Redis client instance
export default myRedisClient;

