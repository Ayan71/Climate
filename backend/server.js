const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const seedSuperAdminAndData = require('./seed/seedData');

// Route files
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const datasetRoutes = require('./routes/datasetRoutes');
const publicRoutes = require('./routes/publicRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const approvalRoutes = require('./routes/approvalRoutes');

const app = express();

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// CORS Configuration
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);


// Lazy DB & Seed initialization middleware for serverless & local runtime
let initPromise = null;
const ensureInit = async (req, res, next) => {
  if (!initPromise) {
    initPromise = (async () => {
      await connectDB();
      await seedSuperAdminAndData();
    })().catch((err) => {
      console.error('[Server Init Error]', err);
      initPromise = null;
    });
  }
  await initPromise;
  next();
};

app.use(ensureInit);

// Request Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static folder for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Healthcheck & Root Routes
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Climate, Energy & Power Data Portal API',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Climate, Energy & Power Data Portal API',
    endpoints: '/api/health',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Climate, Energy & Power Data Portal API',
  });
});

// Mount API Routers
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/approvals', approvalRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `API route '${req.originalUrl}' not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[Server Error] ${err.stack || err}`);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Internal Error',
  });
});

// Export app for Vercel Serverless deployment
module.exports = app;

// Connect DB and Start Server if run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(async () => {
    await seedSuperAdminAndData();
    app.listen(PORT, () => {
      console.log(`
===========================================================
🚀 Climate, Energy & Power API Server running on port ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔑 Default Super Admin: superadmin@vasudhaindia.org
===========================================================
      `);
    });
  });
}

