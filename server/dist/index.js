"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const projects_1 = __importDefault(require("./routes/projects"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/tasks', tasks_1.default);
// Serve static frontend files if in production (e.g., Railway)
const clientBuildPath = path_1.default.join(__dirname, '../../client/dist');
app.use(express_1.default.static(clientBuildPath));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(clientBuildPath, 'index.html'));
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
