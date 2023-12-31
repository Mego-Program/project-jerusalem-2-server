import express, { query } from "express";
import Project from "./project.js";
import ProjectNames from "./listProjects.js";

const deshRouter = express.Router();

deshRouter.get('/tasks',async(req,res)=>{
    const userName = req.headers.authorization
    if(!userName){res.status(500).send('no user name found');return}
    try{
        const listTasks = await Project.find({'assignee.userName':userName})
        const responseObject = {
            n: 0,
            i: 0,
            c: 0,
            f: 0,
          };
          listTasks.forEach((task) => {
            const { status } = task;
            if (status === 'Not started') {
              responseObject.n += 1;
            } else if (status === 'In progress') {
              responseObject.i += 1;
            } else if (status === 'Completed') {
              responseObject.c += 1;
            } else if (status === 'Close') {
              responseObject.f += 1;
            }
          });
      
          res.status(200).json(responseObject);
        } catch (error) {
          console.error('Error retrieving tasks:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });



export default deshRouter