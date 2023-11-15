import express from "express";
import mongoose from "mongoose";

const missionsRouter = express.Router();

// Function to get or create a model based on the provided collection name
function getModel(collectionName) {
  let MissionModel;

  try {
    // Check if the model already exists to avoid overwriting
    MissionModel = mongoose.model(collectionName);
  } catch (e) {
    // If the model doesn't exist, create it
    const schema = new mongoose.Schema({
      id: String,
      pic: String,
      man_in_charge: String,
      header: String,
      content: String,
      deadline: String,
      status: String,
      category: String,
      assignee: String,
      milestone: String,
      issue_type: String,
    });
    MissionModel = mongoose.model(collectionName, schema);
  }

  return MissionModel;
}

// Route handler to find missions based on status and update the name field
missionsRouter.post('/:collectionName/:field', async (req, res) => {
  const { collectionName, field } = req.params;
  const { id, update } = req.body;

  try {
    // Get the model dynamically based on the collection name
    const MissionModel = getModel(collectionName);
    const mission = await MissionModel.findOne({id:id})
    // Use findOneAndUpdate to find and update the document
    const updatedMission = await MissionModel.findOneAndUpdate(
      { id: id },
      { $set: { [field]: update} },
      { new: true } // Return the updated document
    );

    if (!updatedMission) {
      return res.status(404).json({ error: 'Mission not found', details: `No mission with the specified id` });
    }

    res.json(updatedMission);
  } catch (error) {
    console.error('Error updating mission name:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

export default missionsRouter;
