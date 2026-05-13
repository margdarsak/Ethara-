import { Router, Response } from 'express';
import prisma from '../prisma';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Create Project (Admin Only)
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, description, memberIds } = req.body;
  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        members: {
          create: memberIds?.map((userId: string) => ({ userId })) || []
        }
      },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true } } }
        }
      }
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// List Projects
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const role = req.user!.role;

    if (role === 'ADMIN') {
      const projects = await prisma.project.findMany({
        include: { _count: { select: { tasks: true, members: true } } }
      });
      res.json(projects);
      return;
    }

    // Members see projects they are part of
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: { userId }
        }
      },
      include: { _count: { select: { tasks: true, members: true } } }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Project Details
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id: id as string },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        tasks: { include: { assignee: { select: { id: true, name: true } } } }
      }
    });

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Project (Admin Only)
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, description, memberIds } = req.body;
  try {
    const existingProject = await prisma.project.findUnique({ where: { id: id as string } });
    if (!existingProject) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Update basic info
    const updatedProject = await prisma.project.update({
      where: { id: id as string },
      data: {
        name,
        description,
      },
    });

    // Update members if provided
    if (memberIds) {
      // First remove all existing members
      await prisma.projectMember.deleteMany({
        where: { projectId: id as string }
      });
      // Then create new members
      if (memberIds.length > 0) {
        await prisma.projectMember.createMany({
          data: memberIds.map((userId: string) => ({
            projectId: id as string,
            userId
          }))
        });
      }
    }

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Project (Admin Only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const existingProject = await prisma.project.findUnique({ where: { id: id as string } });
    if (!existingProject) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    await prisma.project.delete({
      where: { id: id as string },
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
