import express  from 'express';
import mongoose from 'mongoose';
import Project from './project.js';
import ProjectNames from './listProjects.js';


const router = express.Router();

  router.post('/addNewProject', async (req, res) => {
    const { name, names } = req.body
    try {
      const newProject = new ProjectNames({
       name:name,
        assigneeList:names
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
// change it to get real names from infra
router.get('/allNames', async (req,res)=>{
  const names =  [{
    name:'Lily',
    pic:''},
    {name:'Peter',
    pic:''},
    {name:'Grace',
    pic:''},
    {name:'Alice',
    pic:''},
    {name:'Jack',
    pic:''},]
    try{
      res.send(names)
    }
    catch(err){console.log('error getting names:',err);}
})


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

router.post('/deleteProject', async (req,res)=>{
  const {projectName} = req.body
  try{
    const missionsToDelete = await Project.find({projectName:projectName})
  const projectToDelete  =await ProjectNames.findOne({name:projectName})

if(missionsToDelete.length>0&&projectToDelete){
  try{
    await projectToDelete.deleteOne()

   missionsToDelete.map(async(mission)=> {await mission.deleteOne()})
  }catch(error){console.log(`error while find project and missions to delete, ${projectName}:${error}`);}}
  else if(!projectToDelete){console.log('no project found');}
else if(missionsToDelete.length===0&&projectToDelete){
  try{
  await projectToDelete.deleteOne()}catch(error){console.log('error delete empty project:',error);}
}
  }catch(err){console.log('error try to delete the full project ');}
})



router.post('/addMission/:collection',async(req,res)=>{
  const collection = req.params
  const newMission = req.body
  newMission['projectName']=collection.collection
  newMission['assignee']={name:'',pic:''}
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
}catch(err){res.send('error try again'),console.log('error while update mission',(err));}
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