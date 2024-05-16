// Importing Redis client and utility functions for Redis operations
import { createClient } from 'redis';
import { promisify } from 'util';

// RedisClient class for managing Redis connection and common Redis commands
class RedisClient {
  constructor() {
    // Creating a Redis client instance
    this.client = createClient();
    // Listening for any errors in the connection to the Redis server
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to server: ${error}`); // Logging error if connection fails
    });
  }

  // Method to check if the Redis connection is alive
  isAlive() {
    if (this.client.connected) { // Checking if the client is connected to the server
      return true; // Returning true if connected
    }
    return false; // Returning false if not connected
  }

  // Method to get the value for a given key from the Redis server
  async get(key) {
    const redisGet = promisify(this.client.get).bind(this.client); // Promisifying the get method
    const value = await redisGet(key); // Getting the value for the key
    return value; // Returning the value
  }

  // Method to set a key-value pair to the Redis server
  async set(key, value, time) {
    const redisSet = promisify(this.client.set).bind(this.client); // Promisifying the set method
    await redisSet(key, value); // Setting the key-value pair
    await this.client.expire(key, time); // Setting expiry time for the key
  }

  // Method to delete a key-value pair from the Redis server
  async del(key) {
    const redisDel = promisify(this.client.del).bind(this.client); // Promisifying the del method
    await redisDel(key); // Deleting the key-value pair
  }
}

// Creating an instance of the RedisClient class
const redisClient = new RedisClient();
module.exports = redisClient; // Exporting the RedisClient instance

