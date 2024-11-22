require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const exerciseRoutes = require('./routes/exercise');
const routineRoutes = require('./routes/routine');
const workoutRoutes = require('./routes/workout');
const progressRoutes = require('./routes/progress');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Root route
app.get('/', (req, res) => {
  res.send("{    message: 'Welcome to the Fitness App API',    version: '1.0.0',    documentation: '/api'  }");
});

// API information route
app.get('/api', (req, res) => {
  res.json({
    message: 'Fitness App API',
    version: '1.0.0',
    endpoints: [
      { path: '/api/auth', description: 'Authentication routes' },
      { path: '/api/users', description: 'User management routes' },
      { path: '/api/exercises', description: 'Exercise management routes' },
      { path: '/api/routines', description: 'Workout routine routes' },
      { path: '/api/workouts', description: 'Workout logging routes' },
      { path: '/api/progress', description: 'Progress tracking routes' }
    ],
    documentation: 'https://github.com/yourusername/fitness-app-backend/blob/main/API_DOCUMENTATION.md'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/progress', progressRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));