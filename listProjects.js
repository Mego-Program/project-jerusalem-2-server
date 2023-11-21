import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name:String,
    assigneeList:Array
})

const ProjectNames = mongoose.model('projectsnames', projectSchema)
export default ProjectNames