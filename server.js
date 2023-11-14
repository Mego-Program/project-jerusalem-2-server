// server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import projectRouter from './projectRouter.js'; // ודא שהנתיב נכון

dotenv.config();
console.log(process.env.PORT);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());



// ודא שיש לך קריאה לפונקציה use כזו וגם שהנתיב נכון
app.use('/projects', projectRouter);


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

