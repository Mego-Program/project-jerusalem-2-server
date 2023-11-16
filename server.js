// server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import missionsRouter from './missionsRouter.js'
import projectRouter from './projectRouter.js'; // ודא שהנתיב נכון

dotenv.config();
console.log(process.env.PORT);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://project-jerusalem-2.vercel.app', // או את כתובת המקור שלך
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use(express.json());

// ודא שיש לך קריאה לפונקציה use כזו וגם שהנתיב נכון
app.use('/projects', projectRouter);
app.use('/changeMission', missionsRouter);

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

