import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    userInCharge:String,
    name:String,
    assigneeList:Array,
    specList:Array
})

const ProjectNames = mongoose.model('projectsnames', projectSchema)
export default ProjectNames