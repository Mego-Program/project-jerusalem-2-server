import express from 'express';
import ProjectNames from './listProjects.js';
import Project from './project.js';

const specRouter = express.Router();

specRouter.get('/listofprojects/', async (req, res) => {
  try {
    const list = await ProjectNames.find()
    const userList = list.filter((itm)=>itm.assigneeList.some((user)=>user.name===userName))
    res.send(userList.map((itm)=>itm.name))
  }catch (error) {
    console.log('Error getting list of project names:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

specRouter.get('/getspecs',async(req,res)=>{
  try{
    const response = await fetch('https://jlm-specs-2-server.vercel.app/project')
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

specRouter.put('/connectSpecs',async(req,res)=>{
  const {boardName,spec,tasks} = req.body
  const responese = {}
  try{
    const project = await ProjectNames.findOne({name:boardName})
    if(!project){res.status(403).send('project not found')}
   const updateProject = await ProjectNames.findOneAndUpdate(
    {name:boardName},
    {$push:{specList:spec}},
    {new:true}
  )
  responese['connect'] = 'connect spec success'
tasks.map(async (task)=>{
  const newTask = new  Project(task)
  newTask.isSpec = true
  const saveTask = await newTask.save()
  responese['add'] = 'add tasks success'
  res.status(200).json(responese)
})

  }catch(err){res.send('error try edit spec connecting:',err)}
})







export default specRouter;