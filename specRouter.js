import express from 'express';
import ProjectNames from './listProjects.js';

const router = express.Router();

// משימה: לשלוח רשימת בורדים
router.get('/boards', async (req, res) => {
  try {
    const boards = await ProjectNames.find();
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;