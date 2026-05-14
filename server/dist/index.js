import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';

dotenv.config();

const app = express();

// FORCE 8080 to match your successful log output in image_bea977.png
const PORT = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Fix frontend path resolution
const clientBuildPath = path.resolve(__dirname, '../../client/dist');
const indexPath = path.join(clientBuildPath, 'index.html');

// Essential for Railway health checks
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/favicon.ico', (req, res) => res.status(204).end());

if (fs.existsSync(indexPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => res.sendFile(indexPath));
} else {
  app.get('*', (req, res) => {
    res.status(500).send("Frontend build missing. Check build logs.");
  });
}

// BIND TO 0.0.0.0 is non-negotiable for Railway
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
