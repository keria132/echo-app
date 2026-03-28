import express from 'express';

const messageRoutes = express.Router();

messageRoutes.get('/send', (request, response) => {
  response.send('Send messahe endpoint');
});

export default messageRoutes;
