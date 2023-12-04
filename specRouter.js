import express from 'express';
import ProjectNames from './listProjects.js';

const specRouter = express.Router();

specRouter.get('/getspecs',async(req,res)=>{
  try{
    const response = await fetch('https://jlm-specs-2-server.vercel.app/specs')
    const data = await response.json()
    res.send(data)
  }catch(err){console.log('error try to get names of specs:',err);}
})

specRouter.post('/:projectname',async(req,res)=>{
  const {projectname} = req.params
  const newMission = req.body
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {break}
    res.send('invalid message');return 
  }
  if(projectname==='no project found'){res.send('create project first')}{
  newMission['projectName']=projectname
  newMission['assignee']={name:'',pic:''}
  newMission['isSpec']=true
try{
   const mission = new Project(newMission)
   const savedMission = await mission.save();

    res.json(savedMission);
  } catch (error) {
    console.error('Error adding mission:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }}

})







export default specRouter;