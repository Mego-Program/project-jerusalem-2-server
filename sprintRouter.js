import express  from 'express';
import Project from './project.js';
import ProjectNames from './listProjects.js';
import axios from 'axios';


const sprRouter = express.Router();

sprRouter.get('/getdate/:sprintName/:projectName',async(req,res)=>{
  const {sprintName,projectName} = req.params
  try{
    const project = await ProjectNames.findOne({name:projectName})
    const sprint = project.sprint.filter((sprint)=>sprint.name===sprintName)
    if(sprint.length>0){
    res.send(sprint[0].endDate)}
    else{res.send(null)}
  }catch(err){console.log('error try get date:',err);}
  
})

sprRouter.get('/:projectName',async(req,res)=>{
const {projectName} = req.params

try{
  const project = await ProjectNames.findOne({name:projectName})

  res.send(project.sprint)

}catch(e){console.log('error try get sprints',e);}
})

sprRouter.post('/',async(req,res)=>{
    const { name,missions,currentProject,userName,endDate} = req.body
    if (!userName) {res.status(403).send({ auth: false, message: 'No token premission.' });return}
    if(!name||name===''){res.status(403).send('enter sprint name');return}
    try{
    const project = await ProjectNames.findOne({name:currentProject})
    const sprintDetailes = {
      name:name,
      endDate:endDate,
      missions:missions
    }
    await project.updateOne({
      $push:{sprint:sprintDetailes}
    })}catch(e){console.log('error try add sprint')}

  try{
      const missionToUpdate = await Project.find({projectName:currentProject})
      const filteredMission = missionToUpdate.filter((mission) =>
      missions.some((mission1) => mission._id.toString() === mission1._id.toString())
    );

      filteredMission.map(async(mission)=>{
        if(!mission.isSprint||mission.isSprint===''||mission.isSprint==='false'){await mission.updateOne({$set:{isSprint:name}})}
        else{await mission.updateOne({$set:{isSprint:''}})}
      })
      res.status(200).send('sucssus')
    } catch(e){console.log('error try add missions to sprint',e);res.status(500).send('error try add missions')}
})

sprRouter.put('/',async(req,res)=>{
    const {list} =req.body
    console.log(list);
    try{
        list.map(async(itm)=>{
        const updatedMission = await Project.findOneAndUpdate(
            { _id:itm},
            { $set: { isSprint: true} },
            { new: true } 
          )
        })
            res.status(200).send('sucssus')
}catch(e){console.log('error try update misssions to sprint');}
     
})

export default sprRouter