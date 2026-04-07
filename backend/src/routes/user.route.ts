import express from 'express';
import { updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetProtected } from '../middleware/arcjet.middleware.js';

const router = express.Router();

router.use(arcjetProtected, protectRoute);

router.put('/update-profile', protectRoute, updateProfile);

export default router;
