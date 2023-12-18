import express  from 'express';
import Project from './project.js';
import ProjectNames from './listProjects.js';
import axios from 'axios';


const sprRouter = express.Router();

sprRouter.post('/',async(req,res)=>{
    const { name,currentProject,userName,endDate} = req.body
    if (!userName) {res.status(403).send({ auth: false, message: 'No token provided.' });return}
    try{
    const parentProject = await ProjectNames.findOne({name:currentProject})
    const newProject = new ProjectNames({
        userInCharge:userName,
       name:name,
        assigneeList:parentProject.assigneeList,
        specList:parentProject.specList,
        isSprint:currentProject,
        deadLine:endDate
      });
      const savedProject = await newProject.save();
      res.status(200).send('sucssus')}catch(e){console.log('error try add sprint',e);}
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