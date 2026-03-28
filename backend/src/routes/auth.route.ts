import express from 'express';

const authRoutes = express.Router();

authRoutes.get('/signup', (request, response) => {
  response.send('Singup endpoint');
});

authRoutes.get('/login', (request, response) => {
  response.send('Login endpoint');
});

authRoutes.get('/logout', (request, response) => {
  response.send('Logout endpoint');
});

export default authRoutes;
