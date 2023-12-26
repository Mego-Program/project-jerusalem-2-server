
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import projectRouter from './projectRouter.js'; 
import missionRouter from './missionsRouter.js';
import specRouter from './specRouter.js';
import sprRouter from './sprintRouter.js';


dotenv.config();
console.log(process.env.PORT);
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: ['https://project-jerusalem-2.vercel.app','http://localhost:5173',
  "http://localhost:4173","https://jlm-specs-2.vercel.app",'https://infra-jerusalem-2.vercel.app/'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));


app.use(express.json());
app.use('/spec', specRouter);
app.use('/missions',missionRouter)
app.use('/projects', projectRouter);
app.use('/sprints',sprRouter)

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
