import { Router, Response } from 'express';
import prisma from '../prisma';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Create Task (Admin Only)
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, projectId, assigneeId, dueDate } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assigneeId,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// List Tasks (Dashboard)
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const role = req.user!.role;

    if (role === 'ADMIN') {
      const tasks = await prisma.task.findMany({
        include: { assignee: { select: { name: true } }, project: { select: { name: true } } },
        orderBy: { dueDate: 'asc' }
      });
      res.json(tasks);
      return;
    }

    // Members see their tasks
    const tasks = await prisma.task.findMany({
      where: { assigneeId: userId },
      include: { project: { select: { name: true } } },
      orderBy: { dueDate: 'asc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Task Status
router.put('/:id/status', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user!.userId;
  const role = req.user!.role;

  try {
    const task = await prisma.task.findUnique({ where: { id: id as string } });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    if (role !== 'ADMIN' && task.assigneeId !== userId) {
      res.status(403).json({ message: 'Forbidden: Cannot update this task' });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id: id as string },
      data: { status }
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Unassign Task (Admin Only)
router.put('/:id/unassign', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({ where: { id: id as string } });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id: id as string },
      data: { assigneeId: null }
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
