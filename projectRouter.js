// routes/projectRouter.js
import express from 'express';
import Project from './project.js'; // ודא שהנתיב נכון

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  const { name, description } = req.body;

  try {
    const newProject = new Project({ name, description });
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
