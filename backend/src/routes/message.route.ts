import express from 'express';
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
} from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetProtected } from '../middleware/arcjet.middleware.js';

const router = express.Router();

router.use(arcjetProtected, protectRoute);

router.get('/contacts', getAllContacts);
router.get('/chats', getChatPartners);
router.get('/:userId', getMessagesByUserId);

router.post('/send/:userId', sendMessage);

export default router;
