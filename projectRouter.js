import express  from 'express';
import Project from './project.js';
import ProjectNames from './listProjects.js';
import jwt  from 'jsonwebtoken';
import axios from 'axios';


const router = express.Router();

router.post('/listofprojects/', async (req, res) => {
  const {userName} = req.body
  try {

      if(!userName){return}
    const list = await ProjectNames.find()
    const userList = list.filter((itm)=>itm.assigneeList.some((user)=>user.name===userName))
    res.send(userList.map((itm)=>itm.name))
  }catch (error) {
    console.log('Error getting list of project names:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});


  router.post('/', async (req, res) => {
    let userName = null
    const { name, names,specs } = req.body
    if (name===''){res.send('cant create empty name');return}
    try {
    const token = req.headers.authorization;
    if (!token) {res.status(403).send({ auth: false, message: 'No token provided.' });return}
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });return}
    userName = decoded.userName})
      if(!userName){return}
      const newProject = new ProjectNames({
        userInCharge:userName,
       name:name,
        assigneeList:names,
        specList:specs
      });
      const savedProject = await newProject.save();
      res.status(201).json({userInCharge:userName, savedProject:savedProject});
    } catch (error) {
      console.error('Error adding new project:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });
  
  router.put('/',async(req,res)=>{
    const {input,namesToAdd,namesToRemove,projectName,specsToAdd,specsToRemove,userName}= req.body

    try{
      const oldSpecs =await ProjectNames.findOne({name:projectName})
      if(oldSpecs.userInCharge!==userName){res.status(403).json({error:'dont have premission to edit'});return}
      const newSpecs = [...oldSpecs.specList, ...specsToAdd].filter((spec)=>!specsToRemove.some(
        (spec1)=> spec1._id === spec._id))
      const oldNmaes =await ProjectNames.findOne({name:projectName})
      const newnames = [...oldNmaes.assigneeList, ...namesToAdd].filter((name)=>!namesToRemove.some(
        (person)=> person.pic === name.pic && person.name === name.name
      ))
  const updatedBoard = await ProjectNames.findOneAndUpdate(
  { name:projectName},
  input!==''?{ $set: { specList:newSpecs,assigneeList:newnames ,name:input} }:
  { $set: { specList:newSpecs,assigneeList:newnames} },
  { new: true } )

  if(input!==''){
  const updatedMissions = await Project.updateMany({projectName:projectName},{projectName:input});}
        res.status(200).json('edit sucsses')
    }catch(err){console.log('server error while edit board:',err);}
  })


  router.delete('/', async (req,res)=>{
    const {projectName,userName} = req.query

    try{
      const missionsToDelete = await Project.find({projectName:projectName})
    const projectToDelete  =await ProjectNames.findOne({name:projectName})
    if(projectToDelete.userInCharge!==userName){res.status(403).json({error:'dont have premission to edit'});return}

  
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
  try{
    // invalid link
  const response =  await axios.get('http://infra-jerusalem-2-server.vercel.app/allUsersNameImg')
 const data = response.data
      res.send(data)
    }
    // delete when the link to infra fix
    catch(err){console.log('error getting names:',err.status);res.send([{
      name:'Lily',pic:''},
      {name:'Peter',pic:''},
      {name:'Grace',pic:''},
      {name:'Alice',pic:''}
    ])}
})


router.get('/names/:projectName',async (req,res)=>{
  const projName = req.params.projectName
  try{
  const response = await ProjectNames.findOne({name:projName})
  res.send(response.assigneeList)
  }catch(err){console.log('error while trying to get names ',(err));
res.status(500).json({err:'interval server error',details:err.message})}
})

router.get('/specs/:projectName',async (req,res)=>{
  const projName = req.params.projectName
  try{
  const response = await ProjectNames.findOne({name:projName})
  res.send(response.specList)
  }catch(err){console.log('error while trying to get names ',(err));
res.status(500).json({err:'interval server error',details:err.message})}
})


router.get('/username',async(req,res)=>{
  let userName = null
  try {
    const token = req.headers.authorization;
    if (!token) {res.status(403).send({ auth: false, message: 'No token provided.' });return}
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });return}
    userName = decoded.userName})
      if(!userName){return}
  res.send(userName)
  }catch (error) {
    console.log('Error getting list of project names:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }

})













export default router;