// routes/projectRouter.js
import { json } from 'express';
import express  from 'express';
import mongoose from 'mongoose';
import Project from './project.js';
import ProjectNames from './listProjects.js';


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
    const list = await ProjectNames.find()
    res.send(list.map((itm)=>itm.name))
  } catch (error) {
    console.log('Error getting list of project names:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
// post request to add new mission 
router.post('/addMission/:collection',async(req,res)=>{
  const collection = req.params
  const newMission = req.body
  newMission['projectName']=collection.collection
try{
   const mission = new Project(newMission)
   const savedMission = await mission.save();

    res.json(savedMission);
  } catch (error) {
    console.error('Error adding mission:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }

})


// post request to update mission fields
router.post('/post/:collectionName/:field', async (req, res) => {
  const { collectionName, field } = req.params;
  const { id, update } = req.body;
try{
  const current = await Project.findOne({_id:id,projectName:collectionName})
  console.log(current._id);
  const updatedMission = await Project.findOneAndUpdate(
    { _id:id,projectName:collectionName},
    { $set: { [field]: update} },
    { new: true } 
  );
  console.log(updatedMission._id);
  if (current[field]===updatedMission[field]){res.send(updatedMission[field])}
  else{
  if (!updatedMission) {
    return res.status(404).json({ error: 'Mission not found', details: `No mission with the specified id` });
  }
  res.json(updatedMission);}
}catch(err){console.log('error while update mission',(err));}
})


// get request to get all the missions by board name
router.get('/:projectName', async (req, res) => {
  const { projectName } = req.params;

  try {
        const query = await Project.find({ projectName: projectName });
        if (!query) {
          res.send('No project found');
        } else {
          res.send(query);
        }
      } catch (err) {
        console.log('Error:', err);
        res.status(500).send('Internal Server Error');
      }
});

export default router;
