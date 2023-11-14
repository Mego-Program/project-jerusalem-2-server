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
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const db = mongoose.connection;




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

