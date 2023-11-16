import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name:String
})

const ProjectNames = mongoose.model('projectsnames', projectSchema)
export default ProjectNames