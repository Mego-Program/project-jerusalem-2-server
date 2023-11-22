import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectName:String,
      pic: String,
      man_in_charge: String,
      header: String,
      content: String,
      deadline: String,
      status: String,
      category: String,
      assignee: {
        name: { type: String, default: '' },
        pic: { type: String, default: '' }
      },
      milestone: String,
      issue_type: String,
  });

const Project = mongoose.model('allmissions', projectSchema)


export default Project 
