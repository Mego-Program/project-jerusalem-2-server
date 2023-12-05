import mongoose from 'mongoose';
const projectSchema = new mongoose.Schema({
  isSpec: { type: Boolean, default: false }, 
  projectName: { type: String, require:true },
  header: { type: String, require:true},
  content: { type: String, require:true},
  deadline: { type: String, default: '' },
  status: { type: String, default: '' },
  category: { type: String, default: '' },
  assignee: {
    name: { type: String, default: '' },
    pic: { type: String, default: '' }
  },
  milestone: { type: String, default: '' },
  issue_type: { type: String, default: '' },
});

const Project = mongoose.model('allmissions', projectSchema);

export default Project;

