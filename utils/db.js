import { MongoClient } from 'mongodb';

// Define environment variables with default values
const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 27017;
const DEFAULT_DATABASE = 'files_manager';

// Construct MongoDB connection URL
const dbHost = process.env.DB_HOST || DEFAULT_HOST;
const dbPort = process.env.DB_PORT || DEFAULT_PORT;
const dbDatabase = process.env.DB_DATABASE || DEFAULT_DATABASE;
const url = `mongodb://${dbHost}:${dbPort}`;

// Define the DBClient class
class MyDBClient {
  constructor() {
    // Create a new MongoDB client
    this.mongoClient = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
    // Connect to the MongoDB instance
    this.mongoClient.connect().then(() => {
      // Access the database
      this.database = this.mongoClient.db(dbDatabase);
    }).catch((error) => {
      console.log(`Error connecting to MongoDB: ${error}`);
    });
  }

  // Check if the MongoDB connection is alive
  isDBAlive() {
    return this.mongoClient.isConnected();
  }

  // Retrieve the number of users from the 'users' collection
  async numberOfUsers() {
    const usersCollection = this.database.collection('users');
    const userCount = await usersCollection.countDocuments();
    return userCount;
  }

  // Retrieve the number of files from the 'files' collection
  async numberOfFiles() {
    const filesCollection = this.database.collection('files');
    const fileCount = await filesCollection.countDocuments();
    return fileCount;
  }
}

// Create an instance of the DBClient
const myDBClient = new MyDBClient();

// Export the DBClient instance
export default myDBClient;

