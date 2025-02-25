"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TaskBatchSchema = new mongoose_1.Schema({
    items: { type: [String], require: true },
    timestamp: { type: Date, default: Date.now },
});
exports.default = (0, mongoose_1.model)("TaskBatch", TaskBatchSchema);
