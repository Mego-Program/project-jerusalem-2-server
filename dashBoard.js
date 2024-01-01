import express, { query } from "express";
import Project from "./project.js";
import ProjectNames from "./listProjects.js";

function calculateDays(date){
    const endDate = new Date(date);
const today = new Date();
const timeDifference = endDate.getTime() - today.getTime();
return Math.ceil(timeDifference / (1000 * 3600 * 24));
}

const deshRouter = express.Router();

deshRouter.get("/tasks", async (req, res) => {
  const enecodeName = req.headers.authorization;

  const userName = decodeURIComponent(atob(enecodeName));

  if (!userName) {
    res.status(500).send("no user name found");
    return;
  }
  try {
    const listTasks = await Project.find({ "assignee.userName": userName });
    const responseTasks = {
      n: 0,
      i: 0,
      c: 0,
      f: 0,
    };
    listTasks.forEach((task) => {
      const { status } = task;
      if (status === "Not Started") {
        responseTasks.n += 1;
      } else if (status === "In Progress") {
        responseTasks.i += 1;
      } else if (status === "Completed") {
        responseTasks.c += 1;
      } else if (status === "Close") {
        responseTasks.f += 1;
      }
    });

async function sprintsDetailes(){
    const responeseSprints = Object()

    for (const task of listTasks) {
if(task.isSprint){
    
    try{
    const project = await ProjectNames.findOne({name:task.projectName})
    project.sprint.map((spr)=>{
        if(spr.name===task.isSprint){
            
            const date =calculateDays(spr.endDate)
            if (!responeseSprints.hasOwnProperty(task.isSprint)) {
                responeseSprints[task.isSprint] = date;
              }
        }
    })

}catch(e){console.log(e);}
}
}
return responeseSprints}
const sprints = await sprintsDetailes()
const responseObject = {tasks:responseTasks,sprints:sprints}
    res.status(200).json(responseObject);
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





export default deshRouter;
