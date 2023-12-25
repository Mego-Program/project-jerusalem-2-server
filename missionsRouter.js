import express  from 'express';
import Project from './project.js';
import ProjectNames from './listProjects.js';
import axios from 'axios';


const missionRouter = express.Router();


missionRouter.get('/:projectName', async (req, res) => {
    const { projectName } = req.params;
  
    try {
        const project = await ProjectNames.findOne({name:projectName})
        if (!project) {
          res.send([]);
          } else {
            const query = await Project.find({ projectName: projectName });
            res.send(query);
          }
        } catch (err) {
          console.log('Error:', err);
          res.status(500).send('Internal Server Error');
        }
  });


missionRouter.post('/:projectname',async(req,res)=>{
    const {projectname} = req.params
    const newMission = req.body
    if(typeof(req.body)===Array){req.body.map((newM)=>addMassion(req,res))}
    else{addMassion(req,res)}
    async function addMassion(req,res){
    for (const key in newMission) {
      if (newMission[key] !== undefined && newMission[key] !== null && newMission[key] !== '') {break}
      res.send('invalid message');return 
    }
    if(projectname==='no project found'){res.send('create project first')}{
    newMission['projectName']=projectname
  try{
     const mission = new Project(newMission)
     const savedMission = await mission.save();
  
      res.json(savedMission);
    } catch (error) {
      console.error('Error adding mission:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }}}
  
  })

  missionRouter.put('/:projectname/:field', async (req, res) => {
    const { projectname, field } = req.params;
    const { id, update } = req.body;
    if(update===''||update===null){
      res.send('invalid update');return
    }
  try{
    const current = await Project.findOne({_id:id,projectName:projectname})
    const updatedMission = await Project.findOneAndUpdate(
      { _id:id,projectName:projectname},
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
  

missionRouter.delete('/:projectname',async(req,res)=>{
    const {id} = req.body
    const {projectname} = req.params
    try{
    if (!id || !projectname) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }
    const missionToDelete = await Project.findOne({ _id: id, projectName: projectname});
    if (!missionToDelete) {
      return res.status(404).json({ error: 'Mission not found.' });
    }
    if(missionToDelete.isSpec){
     const responese = axios.delete('',{data:{id:missionToDelete._id,boardNmae:missionToDelete.projectName}})
    }
    await missionToDelete.deleteOne();

    return res.status(200).json({ message: 'Mission deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error.' });
  }
  })



export default missionRouter