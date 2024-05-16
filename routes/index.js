import express from 'express';
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController.js';
import AuthController from '../controllers/AuthController.js'; // Add this line to import AuthController

const router = express.Router();

// Define routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect); // Add this line for GET /connect endpoint
router.get('/disconnect', AuthController.getDisconnect); // Add this line for GET /disconnect endpoint
router.get('/users/me', UsersController.getMe); // Add this line for GET /users/me endpoint

export default router;

