const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/loginDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a User schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', UserSchema);
const User1 = mongoose.model('registers', UserSchema);

// Register route
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User1({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User successfully created');
  } catch (error) {
    console.error('Error during registration:', error); // Log the error
    res.status(500).send({ message: 'Internal server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      res.status(200).send({ message: 'Login successful', username: user.username });
    } else {
      res.status(401).send({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error); // Log the error
    res.status(500).send({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
