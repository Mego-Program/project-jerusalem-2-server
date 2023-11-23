import express  from 'express';
import mongoose from 'mongoose';
import Project from './project.js';
import ProjectNames from './listProjects.js';


const router = express.Router();

router.get('/listofprojects', async (req, res) => {
  try {
    const list = await ProjectNames.find()
    res.send(list.map((itm)=>itm.name))
  } catch (error) {
    console.log('Error getting list of project names:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

  router.post('/', async (req, res) => {
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
  
  router.put('/',async(req,res)=>{
    const {input,namesToAdd,namesToRemove,projectName}= req.body
    try{
      const oldNmaes =await ProjectNames.findOne({name:projectName})
      const newnames = [...oldNmaes.assigneeList, ...namesToAdd].filter((name)=>!namesToRemove.some(
        (person)=> person.pic === name.pic && person.name === name.name
      ))
          const updatedBoard = await ProjectNames.findOneAndUpdate(
            { name:projectName},
            input!==''?{ $set: { assigneeList:newnames ,name:input} }:{ $set: { assigneeList:newnames} },
            { new: true } )
          if(input!==''){
        const updatedMissions = await Project.updateMany({projectName:projectName},{projectName:input});}
        res.status(200).json('edit sucsses')
    }catch(err){console.log('server error while edit board:',err);}
  })
  router.delete('/', async (req,res)=>{
    const projectName = req.query.projectName;
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
  res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
 
    console.error('Error while deleting project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  })




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















export default router;