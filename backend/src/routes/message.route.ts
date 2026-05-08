import express from 'express';
import { getMessagesByUserId, sendMessage } from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetProtected } from '../middleware/arcjet.middleware.js';
import { validateObjectId } from '../middleware/validation.middleware.js';

const router = express.Router();

router.use(arcjetProtected, protectRoute);

router.get('/:userId', validateObjectId('userId'), getMessagesByUserId);
router.post('/send/:userId', validateObjectId('userId'), sendMessage);

export default router;
