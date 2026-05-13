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
// Create Project (Admin Only)
router.post('/', auth_1.authenticate, auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, memberIds } = req.body;
    try {
        const project = yield prisma_1.default.project.create({
            data: {
                name,
                description,
                members: {
                    create: (memberIds === null || memberIds === void 0 ? void 0 : memberIds.map((userId) => ({ userId }))) || []
                }
            },
            include: {
                members: {
                    include: { user: { select: { id: true, name: true, email: true } } }
                }
            }
        });
        res.status(201).json(project);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
// List Projects
router.get('/', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const role = req.user.role;
        if (role === 'ADMIN') {
            const projects = yield prisma_1.default.project.findMany({
                include: { _count: { select: { tasks: true, members: true } } }
            });
            res.json(projects);
            return;
        }
        // Members see projects they are part of
        const projects = yield prisma_1.default.project.findMany({
            where: {
                members: {
                    some: { userId }
                }
            },
            include: { _count: { select: { tasks: true, members: true } } }
        });
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
// Get Project Details
router.get('/:id', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const project = yield prisma_1.default.project.findUnique({
            where: { id: id },
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
exports.default = router;
