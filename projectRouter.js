import express  from 'express';
import mongoose from 'mongoose';
import Project from './project.js';
import ProjectNames from './listProjects.js';


const router = express.Router();





  router.post('/addNewProject', async (req, res) => {
    const { name, persons } = req.body
    try {
      const newProject = new ProjectNames({
       name:name,
        assigneeList:persons
      });
      const savedProject = await newProject.save();
      res.status(201).json(savedProject);
    } catch (error) {
      console.error('Error adding new project:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });
  

router.get('/listOfProjects', async (req, res) => {
  try {
    const list = await ProjectNames.find()
    res.send(list.map((itm)=>itm.name))
  } catch (error) {
    console.log('Error getting list of project names:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});


router.get('/names/:projectName',async (req,res)=>{
  const projName = req.params.projectName
  try{
  const response = await ProjectNames.findOne({name:projName})
  res.send(response.assigneeList)
  }catch(err){console.log('error while trying to get names ',(err));
res.status(500).json({err:'interval server error',details:err.message})}
})

router.post('/delete/:projectName',async(req,res)=>{
  const {id} = req.body
  const projName = req.params.projectName
  try{
  if (!id || !projName) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }
  const missionToDelete = await Project.findOne({ _id: id, projectName: projName });
  if (!missionToDelete) {
    return res.status(404).json({ error: 'Mission not found.' });
  }
  await missionToDelete.deleteOne();
  return res.status(200).json({ message: 'Mission deleted successfully.' });
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: 'Internal Server Error.' });
}
})



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



router.post('/post/:collectionName/:field', async (req, res) => {
  const { collectionName, field } = req.params;
  const { id, update } = req.body;
try{
  const current = await Project.findOne({_id:id,projectName:collectionName})
  const updatedMission = await Project.findOneAndUpdate(
    { _id:id,projectName:collectionName},
    { $set: { [field]: update} },
    { new: true } 
  );
  if (current[field]===updatedMission[field]){res.send(updatedMission[field])}
  else{
  if (!updatedMission) {
    return res.status(404).json({ error: 'Mission not found', details: `No mission with the specified id` });
  }
  res.json(updatedMission);}
}catch(err){console.log('error while update mission',(err));}
})



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