import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Import your routes - Ensure these filenames match exactly
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';

dotenv.config();

const app = express();

// 1. DYNAMIC PORT: Railway injects this. 8080 is a safe fallback for Railway.
const PORT = process.env.PORT || 8080;

// 2. PATH RESOLUTION: Fixes __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// 3. FRONTEND PATH: Adjusted to look outside the 'server' directory
// This assumes structure: /root/server/index.js and /root/client/dist/
const clientBuildPath = path.resolve(__dirname, '../../client/dist');
const indexPath = path.join(clientBuildPath, 'index.html');

// 4. HEALTH CHECK: Helps Railway's proxy verify the container is ready
app.get('/health', (req, res) => res.status(200).send('OK'));

// Prevent favicon noise
app.get('/favicon.ico', (req, res) => res.status(204).end());

// 5. STATIC FILES & SPA FALLBACK
if (fs.existsSync(indexPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(indexPath);
  });
} else {
  console.error('CRITICAL: Frontend build not found at', indexPath);
  app.get('*', (req, res) => {
    res.status(500).send(`Frontend build missing at: ${indexPath}`);
  });
}

// 6. BIND TO 0.0.0.0: Mandatory for Railway/Docker networking
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Internal directory: ${__dirname}`);
});
