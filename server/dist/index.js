import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'; // Ensure .js extension if using ES Modules
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// FIX 1: Railway injects PORT automatically. Default to 8080 to match your logs.
const PORT = process.env.PORT || 8080;

// Handle ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// FIX 2: Better path resolution for Monorepos
// If your server is in a 'server' folder, you may need to go up one level
const clientBuildPath = path.resolve(__dirname, '../../client/dist');
const indexPath = path.join(clientBuildPath, 'index.html');

// Logging for Railway Deploy Logs
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Listening on Port: ${PORT}`);
console.log(`Checking for Frontend at: ${indexPath}`);

// Prevent favicon 502/404 noise
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Health Check for Railway (helps prevent 502 during startup)
app.get('/health', (req, res) => res.status(200).send('OK'));

// Serve frontend safely
if (fs.existsSync(indexPath)) {
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(indexPath);
  });
} else {
  // If the build is missing, this helps you debug in the browser
  app.get('*', (req, res) => {
    res.status(500).json({
      error: "Frontend build not found",
      checkedPath: indexPath,
      suggestion: "Check if 'npm run build' ran for the client in your Railway pipeline."
    });
  });
}

// FIX 3: Ensure the host is 0.0.0.0 for container accessibility
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server ready at http://0.0.0.0:${PORT}`);
});
