const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Attempting to connect to MongoDB...');
console.log('Connection string:', MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://$1:****@'));

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => {
        console.log('MongoDB connected successfully');
        console.log('Database name:', mongoose.connection.name);
    })
    .catch(err => {
        console.log('MongoDB connection error:');
        console.log('Error name:', err.name);
        console.log('Error message:', err.message);
        console.log('Full error:', err);
    });

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/bets', require('./routes/bets'));
app.use('/api/odds', require('./routes/odds'));

app.get('/', (req, res) => {
    res.json({
        message: 'Sports Betting API',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        status: 'OK',
        database: dbStatus,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get('/test-db', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({
                status: 'error',
                message: 'Database not connected',
                readyState: mongoose.connection.readyState
            });
        }

        const collections = await mongoose.connection.db.listCollections().toArray();
        res.json({
            status: 'success',
            message: 'Database connection test passed',
            collections: collections.map(c => c.name),
            readyState: mongoose.connection.readyState
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Database connection test failed',
            error: error.message,
            readyState: mongoose.connection.readyState
        });
    }
});

// 404 handler for undefined routes .
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});

// error handling middleware!!!!!111
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message,
        path: req.path
    });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log('\nServer started successfully.');
        console.log(`Running on port ${PORT}`);
        console.log(`Access the API at: http://localhost:${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
        console.log(`Database test: http://localhost:${PORT}/test-db`);
        console.log('\nAvailable endpoints:');
        console.log('   GET  /              - API status');
        console.log('   GET  /health        - Health check');
        console.log('   GET  /test-db       - Test database connection');
        console.log('   POST /api/auth/login - User login');
        console.log('   POST /api/auth/register - User registration');
        console.log('   GET  /api/odds      - Get sports odds');
        console.log('   GET  /api/bets      - Get user bets');
        console.log('   POST /api/bets      - Place a bet');
    });
}

module.exports = app;