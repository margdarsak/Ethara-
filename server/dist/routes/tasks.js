"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Create Task (Admin Only)
router.post('/', auth_1.authenticate, auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, projectId, assigneeId, dueDate } = req.body;
    try {
        const task = yield prisma_1.default.task.create({
            data: {
                title,
                description,
                projectId,
                assigneeId,
                dueDate: dueDate ? new Date(dueDate) : null
            }
        });
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
// List Tasks (Dashboard)
router.get('/', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const role = req.user.role;
        if (role === 'ADMIN') {
            const tasks = yield prisma_1.default.task.findMany({
                include: { assignee: { select: { name: true } }, project: { select: { name: true } } },
                orderBy: { dueDate: 'asc' }
            });
            res.json(tasks);
            return;
        }
        // Members see their tasks
        const tasks = yield prisma_1.default.task.findMany({
            where: { assigneeId: userId },
            include: { project: { select: { name: true } } },
            orderBy: { dueDate: 'asc' }
        });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
// Update Task Status
router.put('/:id/status', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;
    const role = req.user.role;
    try {
        const task = yield prisma_1.default.task.findUnique({ where: { id: id } });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        if (role !== 'ADMIN' && task.assigneeId !== userId) {
            res.status(403).json({ message: 'Forbidden: Cannot update this task' });
            return;
        }
        const updatedTask = yield prisma_1.default.task.update({
            where: { id: id },
            data: { status }
        });
        res.json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
exports.default = router;
