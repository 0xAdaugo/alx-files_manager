// Importing required modules and libraries
import sha1 from 'sha1'; // Importing sha1 for password hashing
import { ObjectID } from 'mongodb'; // Importing ObjectID for MongoDB operations
import Queue from 'bull'; // Importing Bull library for handling queues
import dbClient from '../utils/db'; // Importing the database client utility
import redisClient from '../utils/redis'; // Importing the Redis client utility

// Initializing a queue instance for user operations
const userQueue = new Queue('userQueue', 'redis://127.0.0.1:6379');

// UsersController class for handling user-related operations
class UsersController {
  // Method to create a new user
  static postNew(request, response) {
    const { email } = request.body; // Extracting email from request body
    const { password } = request.body; // Extracting password from request body

    if (!email) { // If email is missing
      response.status(400).json({ error: 'Missing email' }); // Return missing email error
      return;
    }
    if (!password) { // If password is missing
      response.status(400).json({ error: 'Missing password' }); // Return missing password error
      return;
    }

    const users = dbClient.db.collection('users'); // Getting the users collection from the database
    users.findOne({ email }, (err, user) => { // Checking if email already exists
      if (user) { // If user already exists
        response.status(400).json({ error: 'Already exist' }); // Return already exists error
      } else { // If user does not exist
        const hashedPassword = sha1(password); // Hashing the password
        users.insertOne( // Inserting user data into the database
          {
            email,
            password: hashedPassword,
          },
        ).then((result) => { // Handling successful insertion
          response.status(201).json({ id: result.insertedId, email }); // Sending response with user ID and email
          userQueue.add({ userId: result.insertedId }); // Adding user to the queue for further processing
        }).catch((error) => console.log(error)); // Catching any errors during insertion
      }
    });
  }

  // Method to get user information using authentication token
  static async getMe(request, response) {
    const token = request.header('X-Token'); // Extracting token from request headers
    const key = `auth_${token}`; // Constructing Redis key for user authentication
    const userId = await redisClient.get(key); // Retrieving user ID from Redis using token
    if (userId) { // If user ID is found
      const users = dbClient.db.collection('users'); // Getting the users collection from the database
      const idObject = new ObjectID(userId); // Creating ObjectID from user ID
      users.findOne({ _id: idObject }, (err, user) => { // Finding user with the given ID
        if (user) { // If user found
          response.status(200).json({ id: userId, email: user.email }); // Sending response with user ID and email
        } else { // If user not found
          response.status(401).json({ error: 'Unauthorized' }); // Return unauthorized error
        }
      });
    } else { // If user ID not found
      console.log('Hupatikani!'); // Log a message indicating token not found
      response.status(401).json({ error: 'Unauthorized' }); // Return unauthorized error
    }
  }
}

module.exports = UsersController; // Exporting UsersController class

