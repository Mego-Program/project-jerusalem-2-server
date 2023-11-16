import mongoose from "mongoose";
function findProject(name) {
    let Project;
  
    try {
      // Check if the model already exists
      Project = mongoose.model(name);
    } catch (e) {
      // If the model doesn't exist, create it
      const projectSchema = new mongoose.Schema({
        name: {
          type: String,
          required: true,
        },
        description: {
          type: Array,
          required: true,
          default: [],
        },
      });
      Project = mongoose.model(name, projectSchema);
    }
  
    return Project;
  }
  
  export default findProject;
  
