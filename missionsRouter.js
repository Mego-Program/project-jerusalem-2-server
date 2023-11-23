import express  from 'express';
import Project from './project.js';
import ProjectNames from './listProjects.js';


const missionRouter = express.Router();


missionRouter.get('/:projectName', async (req, res) => {
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

  
missionRouter.post('/:projectname',async(req,res)=>{
    const {projectname} = req.params
    const newMission = req.body
    newMission['projectName']=projectname
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

  missionRouter.put('/:projectname/:field', async (req, res) => {
    const { projectname, field } = req.params;
    const { id, update } = req.body;
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
    if (!id || !projName) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }
    const missionToDelete = await Project.findOne({ _id: id, projectName: projectname });
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



export default missionRouter