import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
    // כאן תוכל להמשיך עם הפעולות שלך
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
  
const db = mongoose.connection;

// תמיד כדאי להוסיף טיפול בארורים בכל התחברות או פעולה במסד הנתונ
