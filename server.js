// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('./passport');

dotenv.config();
const app = express();

app.use(express.json());
app.use(passport.initialize());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');  // ✅ Added user profile routes
const chatRoutes = require('./routes/chat');
const voiceRoutes = require('./routes/voice');
const sosRoutes = require('./routes/sos');
const locationRoutes = require('./routes/location');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);  // ✅ Use profile management routes
app.use('/api/chat', chatRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/location', locationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
