// Importing MongoClient for MongoDB operations
import { MongoClient } from 'mongodb';

// Defining constants for database connection
const HOST = process.env.DB_HOST || 'localhost'; // Default host
const PORT = process.env.DB_PORT || 27017; // Default port
const DATABASE = process.env.DB_DATABASE || 'files_manager'; // Default database name
const url = `mongodb://${HOST}:${PORT}`; // Constructing MongoDB connection URL

// DBClient class for managing MongoDB connection and database operations
class DBClient {
  constructor() {
    // Initializing MongoDB client with connection options
    this.client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
    // Connecting to MongoDB server
    this.client.connect().then(() => {
      this.db = this.client.db(`${DATABASE}`); // Getting the database instance
    }).catch((err) => {
      console.log(err); // Logging any errors during connection
    });
  }

  // Method to check if the database connection is alive
  isAlive() {
    return this.client.isConnected(); // Returning the connection status
  }

  // Method to get the number of users in the database
  async nbUsers() {
    const users = this.db.collection('users'); // Getting the users collection
    const usersNum = await users.countDocuments(); // Counting the number of documents in the users collection
    return usersNum; // Returning the number of users
  }

  // Method to get the number of files in the database
  async nbFiles() {
    const files = this.db.collection('files'); // Getting the files collection
    const filesNum = await files.countDocuments(); // Counting the number of documents in the files collection
    return filesNum; // Returning the number of files
  }
}

// Creating an instance of the DBClient class
const dbClient = new DBClient();
module.exports = dbClient; // Exporting the DBClient instance

