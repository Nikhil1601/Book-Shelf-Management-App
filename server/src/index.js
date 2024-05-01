

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors middleware
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');

const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection function
const connectToMongoDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/BooksApp', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

// Connect to MongoDB
connectToMongoDB();

// Routes for user
app.use('/user', userRoutes);

// Routes for books

app.use('/books', bookRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
