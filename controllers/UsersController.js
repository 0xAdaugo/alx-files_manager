import bcrypt from 'bcrypt';
import myDBClient from '../utils/db.js';

const UsersController = {
  // Endpoint to create a new user
  postNew: async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      // Check if email already exists in DB
      const userExists = await myDBClient.database.collection('users').findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save the new user in the database
      const newUser = { email, password: hashedPassword };
      const result = await myDBClient.database.collection('users').insertOne(newUser);

      // Return the newly created user
      const { _id } = result.insertedId;
      const responseUser = { id: _id, email };
      return res.status(201).json(responseUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export default UsersController;

