import redisClient from '../utils/redis'; // Import the redis client utility for interacting with Redis
import dbClient from '../utils/db'; // Import the database client utility for interacting with MongoDB

class AppController {
  // Method to get the status of the application
  static getStatus(request, response) {
    response.status(200).json({ redis: redisClient.isAlive(), db: dbClient.isAlive() });
  }

  // Method to get statistics of the application
  static async getStats(request, response) {
    const usersNum = await dbClient.nbUsers(); // Retrieve the number of users from the database
    const filesNum = await dbClient.nbFiles(); // Retrieve the number of files from the database
    response.status(200).json({ users: usersNum, files: filesNum });
  }
}

module.exports = AppController;

