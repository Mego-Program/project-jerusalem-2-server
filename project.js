import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectName:String,
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

const Project = mongoose.model('allmissions', projectSchema)


export default Project 

