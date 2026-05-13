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

// Railway/Vercel production-safe frontend path
const clientBuildPath = path.resolve(__dirname, '../../client/dist');
const indexPath = path.join(clientBuildPath, 'index.html');

console.log('Client build path:', clientBuildPath);
console.log('Index path exists:', fs.existsSync(indexPath));

// Serve frontend only if build exists
if (fs.existsSync(indexPath)) {
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(indexPath);
  });
} else {
  app.get('*', (req, res) => {
    res.status(500).send('Frontend build not found. Check client build process.');
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});import express from 'express';
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

// Railway/Vercel production-safe frontend path
const clientBuildPath = path.resolve(__dirname, '../../client/dist');
const indexPath = path.join(clientBuildPath, 'index.html');

console.log('Client build path:', clientBuildPath);
console.log('Index path exists:', fs.existsSync(indexPath));

// Serve frontend only if build exists
if (fs.existsSync(indexPath)) {
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(indexPath);
  });
} else {
  app.get('*', (req, res) => {
    res.status(500).send('Frontend build not found. Check client build process.');
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
