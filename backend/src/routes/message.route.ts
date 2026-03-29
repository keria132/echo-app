import express from 'express';

const messageRoutes = express.Router();

messageRoutes.get('/send', (_, response) => {
  response.send('Send messahe endpoint');
});

export default messageRoutes;
