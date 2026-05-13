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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma"));
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = yield prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const userRole = role === 'ADMIN' ? 'ADMIN' : 'MEMBER';
        const user = yield prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: userRole,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.default.user.findMany({ select: { id: true, name: true, email: true, role: true } });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
exports.default = router;
