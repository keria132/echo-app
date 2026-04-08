import express from 'express';
import { signup, login, logout } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetProtected } from '../middleware/arcjet.middleware.js';

const router = express.Router();

router.use(arcjetProtected);

router.post('/signup', signup);
router.post('/login', login);
router.delete('/logout', logout);

router.get('/check', protectRoute, (request, response) => response.status(200).json(request.user));

export default router;
