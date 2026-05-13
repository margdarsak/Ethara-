import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Correct Railway production frontend path
const clientBuildPath = path.resolve(process.cwd(), 'client/dist');
const indexPath = path.join(clientBuildPath, 'index.html');

// Debug logs
console.log('Working directory:', process.cwd());
console.log('Client build path:', clientBuildPath);
console.log('Index path:', indexPath);
console.log('Index exists:', fs.existsSync(indexPath));

// Prevent favicon 502 crash
app.get('/favicon.ico', (req, res) => {
  return res.status(204).end();
});

// Serve frontend safely
if (fs.existsSync(indexPath)) {
  app.use(express.static(clientBuildPath));

  // SPA fallback for React Router / Vite
  app.get('*', (req, res) => {
    return res.sendFile(indexPath);
  });
} else {
  app.get('*', (req, res) => {
    return res.status(500).send(`
Frontend build not found.

Working Directory: ${process.cwd()}
Client Build Path: ${clientBuildPath}
Index Path: ${indexPath}

Check Railway build process and ensure client/dist exists.
    `);
  });
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
