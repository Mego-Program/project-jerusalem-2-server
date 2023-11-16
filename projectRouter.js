// routes/projectRouter.js
import { json } from 'express';
import express  from 'express';
import mongoose from 'mongoose';


const router = express.Router();

router.post('/addNewProject', async (req, res) => {
  const { name } = req.body;
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


// get request to send the all boards exsisting
router.get('/listOfProjects', async (req, res) => {
  try {
    // Await the promise returned by toArray()
    const collections = await mongoose.connection.db.listCollections().toArray();
    const list = collections.map(collection => collection.name);
    res.json(list); // Send a JSON response with a message
  } catch (error) {
    console.log('Error getting list of project names:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});



// Create a function that returns a model based on the provided collection name
function getModel(collectionName) {
  let ProjectModel;

  try {
    // Check if the model already exists to avoid overwriting
    ProjectModel = mongoose.model(collectionName);
  } catch (e) {
    // If the model doesn't exist, create it
    const schema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      description: {
        type: Array,
        required: true,
        default: [],
      },
    });
    ProjectModel = mongoose.model(collectionName, schema);
  }

  return ProjectModel;
}

// Your route handler
router.get('/:projectName', async (req, res) => {
  const { projectName } = req.params;

  try {
    // Get the model dynamically based on the project name
    const ProjectModel = getModel(projectName);

    // Query the existing collection using the dynamically obtained model
    const projects = await ProjectModel.find();

    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found', details: 'The specified project does not exist.' });
    }

    // Project found, return the data
    res.json(projects);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});


 



export default router;
