import express from 'express';
import { signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);

router.get('/login', (_, response) => {
  response.send('Login endpoint');
});

router.get('/logout', (_, response) => {
  response.send('Logout endpoint');
});

export default router;
