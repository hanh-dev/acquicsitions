import express from 'express';

const router = express.Router();

router.post('/sign-up', (req, res) => {
  res.send({ message: 'User signed up successfully' });
});
router.post('/sign-in', (req, res) => {
  res.send({ message: 'User signed in successfully' });
});
router.post('/sign-out', (req, res) => {
  res.send({ message: 'User signed out successfully' });
});

export default router;
