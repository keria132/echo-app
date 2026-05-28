import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetProtected } from '../middleware/arcjet.middleware.js';
import { getChats, patchViewed } from '../controllers/chat.controller.js';

const router = express.Router();

router.use(arcjetProtected, protectRoute);

router.get('/', getChats);
router.patch('/:id/viewed', patchViewed);

export default router;
