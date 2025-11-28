import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import trialsRoutes from './routes/trials.js';
import publicationsRoutes from './routes/publications.js';
import expertsRoutes from './routes/experts.js';
import forumsRoutes from './routes/forums.js';
import favoritesRoutes from './routes/favorites.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trials', trialsRoutes);
app.use('/api/publications', publicationsRoutes);
app.use('/api/experts', expertsRoutes);
app.use('/api/forums', forumsRoutes);
app.use('/api/favorites', favoritesRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'CuraLink API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to CuraLink API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            trials: '/api/trials',
            publications: '/api/publications',
            experts: '/api/experts',
            forums: '/api/forums'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║   🏥 CuraLink API Server Running         ║
║   📡 Port: ${PORT}                         ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}            ║
║   📝 API Docs: http://localhost:${PORT}    ║
╚═══════════════════════════════════════════╝
    `);
});

export default app;
