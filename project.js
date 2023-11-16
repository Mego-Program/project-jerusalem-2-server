// models/project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
      type: Array,
      required: true,
      default:[],
  },
});


const Project = mongoose.model('Project2', projectSchema)

export default Project 

