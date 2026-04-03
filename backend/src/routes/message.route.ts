import express from 'express';

const router = express.Router();

router.get('/send', (_, response) => {
  response.send('Send messahe endpoint');
});

export default router;
