// Import the required modules
const express = require('express');

// Create an Express application
const app = express();

// Define the port to listen on
const port = 3000;

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Define a route to retrieve mocked data
app.get('/api/data', (req, res) => {
    // Simulated data (replace with actual database queries)
    const mockedData = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        // Add more data here
    ];
    res.json(mockedData);
});
