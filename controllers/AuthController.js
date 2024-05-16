import sha1 from 'sha1'; // Import the sha1 library for hashing passwords
import { v4 as uuidv4 } from 'uuid'; // Import the uuidv4 function for generating UUIDs
import dbClient from '../utils/db'; // Import the database client utility for interacting with MongoDB
import redisClient from '../utils/redis'; // Import the redis client utility for interacting with Redis

class AuthController {
  // Method to authenticate a user and generate an authentication token
  static async getConnect(request, response) {
    const authData = request.header('Authorization'); // Retrieve the authorization data from the request header
    let userEmail = authData.split(' ')[1]; // Extract the email and password from the authorization data
    const buff = Buffer.from(userEmail, 'base64'); // Decode the Base64 encoded email and password
    userEmail = buff.toString('ascii'); // Convert the decoded data to ASCII string
    const data = userEmail.split(':'); // Split the decoded data to separate email and password
    if (data.length !== 2) { // Check if both email and password are present
      response.status(401).json({ error: 'Unauthorized' }); // Return unauthorized error if authentication data is incomplete
      return;
    }
    const hashedPassword = sha1(data[1]); // Hash the password using SHA1 algorithm
    const users = dbClient.db.collection('users'); // Access the users collection in the database
    users.findOne({ email: data[0], password: hashedPassword }, async (err, user) => { // Find the user in the database
      if (user) { // If user is found
        const token = uuidv4(); // Generate a unique token using UUID
        const key = `auth_${token}`; // Create a key for storing the token in Redis
        await redisClient.set(key, user._id.toString(), 60 * 60 * 24); // Store the token in Redis with a 24-hour expiration
        response.status(200).json({ token }); // Return the generated token
      } else {
        response.status(401).json({ error: 'Unauthorized' }); // Return unauthorized error if user is not found
      }
    });
  }

  // Method to disconnect a user by deleting the authentication token
  static async getDisconnect(request, response) {
    const token = request.header('X-Token'); // Retrieve the authentication token from the request header
    const key = `auth_${token}`; // Create the key for the token in Redis
    const id = await redisClient.get(key); // Retrieve the user ID associated with the token from Redis
    if (id) { // If user ID is found
      await redisClient.del(key); // Delete the token from Redis
      response.status(204).json({}); // Return empty response with success status
    } else {
      response.status(401).json({ error: 'Unauthorized' }); // Return unauthorized error if token is invalid
    }
  }
}

module.exports = AuthController;

