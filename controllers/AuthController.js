import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import myRedisClient from '../utils/redis.js';
import myDBClient from '../utils/db.js';

const AuthController = {
  // Endpoint to sign-in the user and generate an authentication token
  getConnect: async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
    const [email, password] = decodedCredentials.split(':');

    if (!email || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await myDBClient.database.collection('users').findOne({ email, password: hashedPassword });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    await myRedisClient.set(`auth_${token}`, user._id.toString(), 86400); // 24 hours expiration

    return res.status(200).json({ token });
  },

  // Endpoint to sign-out the user based on the token
  getDisconnect: async (req, res) => {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await myRedisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await myRedisClient.del(`auth_${token}`);

    return res.status(204).send();
  }
};

export default AuthController;

