import { Router } from 'express';
import AppController from '../controllers/AppController'; // Import AppController for handling application-related routes
import UsersController from '../controllers/UsersController'; // Import UsersController for handling user-related routes
import AuthController from '../controllers/AuthController'; // Import AuthController for handling authentication-related routes
import FilesController from '../controllers/FilesController'; // Import FilesController for handling file-related routes

const router = Router();

router.get('/status', AppController.getStatus); // Route to get the status of the application

router.get('/stats', AppController.getStats); // Route to get statistics of the application

router.post('/users', UsersController.postNew); // Route to create a new user

router.get('/connect', AuthController.getConnect); // Route to connect/authenticate a user

router.get('/disconnect', AuthController.getDisconnect); // Route to disconnect a user

router.get('/users/me', UsersController.getMe); // Route to get information about the authenticated user

router.post('/files', FilesController.postUpload); // Route to upload a file

router.get('/files/:id', FilesController.getShow); // Route to get details of a specific file

router.get('/files', FilesController.getIndex); // Route to get a list of files

router.put('/files/:id/publish', FilesController.putPublish); // Route to publish a file

router.put('/files/:id/unpublish', FilesController.putUnpublish); // Route to unpublish a file

router.get('/files/:id/data', FilesController.getFile); // Route to get the data/content of a file

module.exports = router;

