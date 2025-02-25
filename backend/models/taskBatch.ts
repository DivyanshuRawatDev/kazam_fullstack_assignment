import { Schema, model, Document } from "mongoose";

interface ITASKBATCH extends Document {
  items: string[];
  timestamp: Date;
}

const TaskBatchSchema = new Schema<ITASKBATCH>({
  items: { type: [String], require: true },
  timestamp: { type: Date, default: Date.now },
});

export default model<ITASKBATCH>(
  "TaskBatch",
  TaskBatchSchema,
);
