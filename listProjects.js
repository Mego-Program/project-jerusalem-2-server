import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    userInCharge:String,
    name:String,
    assigneeList:Array,
    specList:Array,
    sprint:{type:Array,default:[]},
    deadLine:String

})

const ProjectNames = mongoose.model('projectsnames', projectSchema)
export default ProjectNames