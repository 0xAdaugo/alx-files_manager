import myRedisClient from '../utils/redis.js';
import myDBClient from '../utils/db.js';

const AppController = {
  // Endpoint to check status of Redis and DB
  getStatus: async (req, res) => {
    const redisAlive = myRedisClient.isAlive();
    const dbAlive = myDBClient.isDBAlive();
    const status = { redis: redisAlive, db: dbAlive };
    res.status(200).json(status);
  },

  // Endpoint to get stats (number of users and files)
  getStats: async (req, res) => {
    const usersCount = await myDBClient.numberOfUsers();
    const filesCount = await myDBClient.numberOfFiles();
    const stats = { users: usersCount, files: filesCount };
    res.status(200).json(stats);
  }
};

export default AppController;

