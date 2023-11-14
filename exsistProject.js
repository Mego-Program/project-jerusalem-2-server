// models/project.js
import mongoose from 'mongoose';
function findProject(name){

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

const Project = mongoose.model(name, projectSchema)
return Project
}
export default findProject

