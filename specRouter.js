import express from "express";
import ProjectNames from "./listProjects.js";
import Project from "./project.js";

const specRouter = express.Router();

specRouter.get("/listofprojects/", async (req, res) => {
  try {
    const list = await ProjectNames.find();
    res.send(list.map((itm) => itm.name));
  } catch (error) {
    console.log("Error getting list of project names:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

specRouter.get("/getspecs", async (req, res) => {
  try {
    const response = await fetch(
      "https://jlm-specs-2-server.vercel.app/project"
    );
    const data = await response.json();
    res.send(data);
  } catch (err) {
    console.log("error try to get names of specs:", err);
  }
});

// request to connect new spec and add tasks
// ***add boolean argument if spec already connected and only add tasks *******

specRouter.put("/connectSpecs", async (req, res) => {
  const { boardName, spec, tasks, newSpec } = req.body;
  const responese = {};
  try {
    const project = await ProjectNames.findOne({ name: boardName });
    if (!project) {
      res.status(403).send("project not found");
    }
    if (newSpec) {
      const updateProject = await ProjectNames.findOneAndUpdate(
        { name: boardName },
        { $push: { specList: spec } },
        { new: true }
      );
      responese["connect"] = "connect spec success";
    }
    tasks.map(async (task) => {
      const newTask = new Project(task);
      if (task.deadline && task.deadline !== "") {
        const date = new Date(task.deadline);
        const options = { year: "numeric", month: "long", day: "numeric" };
        newTask.deadline = date.toLocaleDateString("en-US", options);
      }
      newTask.projectName = boardName;
      newTask.isSpec = true;
      newTask.status = "Not Started";
      await newTask.save();
      responese["add"] = "add tasks success";
    });
    res.status(200).json(responese.data);
  } catch (err) {
    res.send("error try edit spec connecting:", err);
  }
});

specRouter.delete("/", async (req, res) => {
  const { boardName, specId } = req.body;
  let massage = "";
  try {
    const missionToDelete = await Project.find({
      projectName: boardName,
      isSpec: true,
    });
    if (!missionToDelete) {
      massage + "1:no mission found";
    }
    const projectToDisconnect = await ProjectNames.findOne({ name: boardName });
    if (!projectToDisconnect) {
      massage + "2:no project found";
    }
    const newList = projectToDisconnect.specList.filter(
      (spec) => spec._id !== specId
    );
    await projectToDisconnect.updateOne({ $set: { specList: newList } });
    missionToDelete.map(async (massion) => await massion.deleteOne());
    return res.status(200).json({ message: "Mission deleted successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal Server Error.", massage: massage });
  }
});

export default specRouter;
