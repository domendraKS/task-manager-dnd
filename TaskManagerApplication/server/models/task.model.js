import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: "Todo",
      enum: ["Todo", "InProgress", "Done"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const TaskModel = mongoose.model("Task", taskSchema);

export default TaskModel;
