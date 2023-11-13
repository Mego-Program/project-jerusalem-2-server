// Import the required modules
import express from 'express';

// Create an Express application
const app = express();

// Define the port to listen on
const port = process.env.PORT || 3000;

// ... השאר של הקוד

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
