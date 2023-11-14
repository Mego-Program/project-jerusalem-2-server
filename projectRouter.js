// routes/projectRouter.js
import express from 'express';
import mongoose from 'mongoose';
import findProject from './exsistProject.js';
import  Project  from './project.js'; // Importing the findProject function


const router = express.Router();

// Dynamic route that takes the project name as a parameter
router.get('/:projectName', async (req, res) => {
  const  projectName  = req.params;
  console.log(projectName.projectName);
  try {
    const projects = await findProject(projectName.projectName).find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



  router.post('/addNewProject', async (req, res) => {
    const { name } = req.body;
    console.log(name);
    try {
      // Assuming 'findProject' returns the appropriate model for the project
      const newProject = new Project({ name, items: [] });
      const savedProject = await newProject.save();
      res.status(201).json(savedProject);
    } catch (error) {
      console.error('Error adding new project:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  
});




export default router;
