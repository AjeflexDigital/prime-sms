import express from 'express';
const router = express.Router();

// Add your user routes here
router.get('/', (req, res) => {
  res.json({ message: 'User routes working' });
});

export default router;