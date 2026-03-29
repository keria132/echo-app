import express from 'express';

const authRoutes = express.Router();

authRoutes.get('/signup', (_, response) => {
  response.send('Singup endpoint');
});

authRoutes.get('/login', (_, response) => {
  response.send('Login endpoint');
});

authRoutes.get('/logout', (_, response) => {
  response.send('Logout endpoint');
});

export default authRoutes;
