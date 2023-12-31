import express from "express";
import Project from "./project.js";
import ProjectNames from "./listProjects.js";
import jwt, { decode } from "jsonwebtoken";
import axios from "axios";

const router = express.Router();

router.post("/listofprojects/", async (req, res) => {
  const { userName } = req.body;
  try {
    if (!userName) {
      return;
    }
    const list = await ProjectNames.find();
    const userList = list.filter(
      (itm) =>
        itm.assigneeList.some((user) => user.userName === userName) ||
        itm.userInCharge === userName
    );
    res.send(userList.map((itm) => itm.name));return
  } catch (error) {
    console.log("Error getting list of project names:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

router.post("/", async (req, res) => {
  const { name, names, specs, userName } = req.body;
  try{
const exist = await ProjectNames.findOne({name:name})
if(exist){console.log('name already exist');res.status(403).send('name already exist');return}
  }catch(e){console.log('error try validate project name');res.status(500)}
  let spec = specs;
  const specList = specs.map((spec) => spec._id);
  if (name === "") {
    res.send("cant create empty name");
    return;
  } else if (!userName) {
    res.status(403).send({ auth: false, message: "No token provided." });
    return;
  }
  if(specs>0){
    try {
      const response = await axios.put(
        "https://jlm-specs-2-server.vercel.app/project/link-board",
        { specId: specList, boardName: name }
      );
      if (!response.data.success) {
        res
          .status(500)
          .send("server error: cannot connect specs - ", response.status);
        spec = [];
      }
      console.log("res:", response.data.success);
    } catch (e) {
      console.log("error connect to spec:", e);
    }}
    try{
    const newProject = new ProjectNames({
      userInCharge: userName,
      name: name,
      assigneeList: names,
      specList: spec,
    });
    const savedProject = await newProject.save();
    res
      .status(201)
      .json({ userInCharge: userName, savedProject: savedProject });
  } catch (error) {
    console.error("Error adding new project:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

router.put("/", async (req, res) => {
  const {
    input,
    namesToAdd,
    namesToRemove,
    projectName,
    specsToAdd,
    specsToRemove,
    userName,
  } = req.body;

  try{
  const exist = await ProjectNames.findOne({name:input})
  if(exist){console.log('name already exist');res.status(403).send('name already exist');return}
    }catch(e){console.log('error try validate project name');res.status(500)}

  try {
    const project = await ProjectNames.findOne({ name: projectName });

    if (project.userInCharge !== userName) {
      res.status(403).json({ error: "dont have premission to edit" });
      return;
    }

    const newSpecs = [...project.specList, ...specsToAdd].filter(
      (spec) => !specsToRemove.some((spec1) => spec1._id === spec._id)
    );

    const newnames = [...project.assigneeList, ...namesToAdd].filter(
      (name) =>
        !namesToRemove.some((person) => person.userName === name.userName)
    );
    let specPush = newSpecs;
    if(specsToAdd.length>0){
    const specList = specsToAdd.map((spec) => spec._id);
    try {
      const response = await axios.put(
        "https://jlm-specs-2-server.vercel.app/project/link-board",
        { specId: specList, boardName: projectName }
      );
      if (!response.data.success) {
        specPush = [];
      }
      console.log("spec responese:", response.status);
    } catch (e) {
      console.log("error connect spec:", e);
    }}
    if (specsToRemove.length>0) {
      const specListRm = specsToRemove.map((spec) => spec._id);
      console.log(specListRm);
    try {
      const response = await axios.put(
        "https://jlm-specs-2-server.vercel.app/project/link-board",
        { specId: specListRm, boardName: ''}
      );
      if (!response.data.success) {
        res
          .status(500)
          .send("server error: cannot connect specs - ", response.data);
        specPush = [];
      }
      console.log("spec responese:", response.status);
    } catch (e) {
      console.log("error connect spec:", e);
    }
    }

    const updatedBoard = await ProjectNames.findOneAndUpdate(
      { name: projectName },
      input !== ""
        ? { $set: { specList: specPush, assigneeList: newnames, name: input } }
        : { $set: { specList: specPush, assigneeList: newnames } },
      { new: true }
    );

    if (input !== "") {
      const updatedMissions = await Project.updateMany(
        { projectName: projectName },
        { projectName: input }
      );
    }
    res.status(200).json("edit sucsses");
  } catch (err) {
    console.log("server error while edit board:", err);
  }
});

router.delete("/", async (req, res) => {
  const { projectName, userName } = req.query;
  try {
    const missionsToDelete = await Project.find({ projectName: projectName });
    const projectToDelete = await ProjectNames.findOne({ name: projectName });
    if (projectToDelete.userInCharge !== userName) {
      res.status(403).json({ error: "dont have premission to edit" });
      return;
    }
    if (!projectToDelete) {
      res.send("error try find project to delete");
      return;
    }
    if (projectToDelete.specList.length > 0) {
      try {
        const response = await axios.put(
          "https://jlm-specs-2-server.vercel.app/project/link-board",
          { specId: projectToDelete.specList, boardName: null }
        );
        console.log("spec response:", response.data);
      } catch (e) {
        console.log("error try delete spec connection");
      }
    }
    if (missionsToDelete.length > 0) {
      try {
        await projectToDelete.deleteOne();
        missionsToDelete.map(async (mission) => {
          await mission.deleteOne();
        });
      } catch (error) {
        console.log(
          `error while find project and missions to delete, ${projectName}:${error}`
        );
      }
    } else if (missionsToDelete.length === 0) {
      try {
        await projectToDelete.deleteOne();
      } catch (error) {
        console.log("error delete empty project:", error);
      }
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error while deleting project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/allNames", async (req, res) => {
  try {
    const response = await axios.get(
      "http://infra-jerusalem-2-server.vercel.app/allUsersNameImg"
    );
    const data = response.data;
    const listNames = data.filter((person) => person.userName);
    res.send(listNames);
  } catch (err) {
    console.log("error getting names:", err.status);
  res.status(500).send('error try get users names')
  }
});

router.get("/names/:projectName", async (req, res) => {
  const { projectName } = req.params;
  try {
    const response = await ProjectNames.findOne({ name: projectName });
    if(!response){res.send([]);return}
    res.send(response.assigneeList);
  } catch (err) {
    console.log("error while trying to get names ", err);
    res
      .status(500)
      .json({ err: "interval server error", details: err.message });
  }
});

router.get("/specs/:projectName", async (req, res) => {
  const { projectName } = req.params;
  try {
    const response = await ProjectNames.findOne({ name: projectName });
    if(!response){res.send([]);return}
    res.send(response.specList);
  } catch (err) {
    console.log("error while trying to get specs ", err);
    res
      .status(500)
      .json({ err: "interval server error", details: err.message });
  }
});

router.get("/projectsdetailes/:projectname", async (req, res) => {
  try {
    const projectname = req.params.projectname;
    const detailes = await ProjectNames.findOne({
      name: projectname,
      isSprint: true,
    });
    if (detailes) {
      res.json(detailes);
    }
  } catch (e) {
    console.log("try find project detailes:", e);
  }
});

router.get("/username", async (req, res) => {
  let userName = null;
  try {
    const token = req.headers.authorization;
  
      if (!token) {
      res.status(403).send({ auth: false, message: "No token provided." });
      return;
    }
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
      console.log('error verify token:',err)

        return;
      }
      userName = decoded.name;
    
    });
    if (!userName) {
      res.status(403).send('error no user recognise')
      return;
      
    }
    res.send(userName);
  } catch (error) {
    console.log("Error getting list of project names:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

export default router;
