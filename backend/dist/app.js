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
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const redis_1 = __importDefault(require("./config/redis"));
const taskBatch_1 = __importDefault(require("./models/taskBatch"));
const mongoose_1 = __importDefault(require("./config/mongoose"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)({ origin: "*" }));
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on("add", (task) => __awaiter(void 0, void 0, void 0, function* () {
        const key = "FULLSTACK_TASK_DIVYANSHU";
        try {
            const result = yield redis_1.default.lPush(key, JSON.stringify(task));
            console.log("LPUSH Result:", result);
            const length = yield redis_1.default.lLen(key);
            if (length > 50) {
                const items = yield redis_1.default.lRange(key, 0, -1);
                const parsedItems = items.map((item) => JSON.parse(item));
                yield new taskBatch_1.default({ items: parsedItems }).save();
                yield redis_1.default.del(key);
            }
            socket.broadcast.emit("newTask", task);
        }
        catch (err) {
            console.error("Error processing task via socket:", err);
            socket.emit("error", { error: "Failed to add task" });
        }
    }));
    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});
app.get("/api/fetchAllTasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const key = "FULLSTACK_TASK_DIVYANSHU";
    try {
        const redisItems = yield redis_1.default.lRange(key, 0, -1);
        const parsedRedisItems = redisItems.map((item) => JSON.parse(item));
        const batches = yield taskBatch_1.default.find().sort({ timestamp: -1 });
        const mongoItems = batches.flatMap((batch) => batch.items);
        const allTasks = [...mongoItems, ...parsedRedisItems];
        res.json(allTasks);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
}));
(0, mongoose_1.default)()
    .then(() => {
    server.listen(8080, () => {
        console.log("Server is running on port 8080");
    });
})
    .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
});
