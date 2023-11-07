// Import the required modules
const express = require('express');
const mongoose = require('mongoose');

// Create an Express application
const app = express();

// Define the port to listen on
const port = 3000;

// Define the schema for the data using Mongoose
const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
});

// Create a Mongoose model based on the schema
const Item = mongoose.model('Item', itemSchema);

// Connect to the MongoDB database
mongoose.connect('mongodb+srv://tzvi-shtesman:A@a1a1a1@cluster0.fptyoym.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Database connection error handling
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

// Define a function to check if an item exists in the database and add it if it doesn't
const checkAndAddItem = (itemName, itemDescription) => {
    // Check if an item with the same name already exists
    Item.findOne({ name: itemName }, (err, existingItem) => {
        if (err) {
            console.error('Error:', err);
            return;
        }

        if (existingItem) {
            console.log('Item already exists:', existingItem);
        } else {
            // Create a new item
            const newItem = new Item({
                name: itemName,
                description: itemDescription,
            });

            // Save the new item to the database
            newItem.save((saveErr, savedItem) => {
                if (saveErr) {
                    console.error('Error:', saveErr);
                } else {
                    console.log('New item added:', savedItem);
                }
            });
        }
    });
};

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
