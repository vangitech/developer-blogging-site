const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const requiredEnvs = [
  'MONGODB_URI',
  'JWT_SECRET',
];

const missingEnvs = requiredEnvs.filter((name) => !process.env[name]);
if (missingEnvs.length > 0) {
  console.error('Missing required environment variables:', missingEnvs.join(', '));
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors({
  origin: ['https://developer-blogging-site.vercel.app/'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log('MongoDB Connected');
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please stop the other process or set PORT to a free port.`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  });