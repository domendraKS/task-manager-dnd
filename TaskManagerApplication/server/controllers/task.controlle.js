import errorHandler from "../middleware/errorHandler.js";
import TaskModel from "../models/task.model.js";

export const createTask = async (req, res, next) => {
  const { title, description, status } = req.body;

  if (!title) {
    return next(errorHandler(400, "Title cannot be empty"));
  }

  try {
    const newTask = new TaskModel({
      title,
      description,
      status,
      userId: req.user.id,
    });

    const savedTask = await newTask.save();

    return res
      .status(201)
      .json({ success: true, message: "Task Added", task: savedTask });
  } catch (error) {
    next(error);
  }
};

export const getAllTask = async (req, res, next) => {
  try {
    const tasks = await TaskModel.find({ userId: req.user.id });

    return res
      .status(200)
      .json({ success: true, message: "Get all task successfully", tasks });
  } catch (error) {
    next(error);
  }
};

export const getOneTask = async (req, res, next) => {
  try {
    const task = await TaskModel.findById(req.params.taskId);
    if (!task) {
      return next(errorHandler(404, "Task not found"));
    }

    if (req.user.id != task.userId) {
      return next(errorHandler(401, "You are not allowed to access this task"));
    }

    return res
      .status(200)
      .json({ success: true, message: "Get task successfully", task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await TaskModel.findById(req.params.taskId);
    if (!task) {
      return next(errorHandler(404, "Task not found"));
    }

    if (req.user.id != task.userId) {
      return next(errorHandler(401, "You are not allowed to delete this task"));
    }

    await TaskModel.findByIdAndDelete(req.params.taskId);

    return res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  const { title, description, status } = req.body;

  if (!title) {
    return next(errorHandler(400, "Fiels cannot be empty"));
  }

  try {
    const task = await TaskModel.findById(req.params.taskId);
    if (!task) {
      return next(errorHandler(404, "Task not found"));
    }

    if (req.user.id != task.userId) {
      return next(errorHandler(401, "You are not allowed to edit this task"));
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(
      req.params.taskId,
      {
        $set: {
          title,
          description,
          status,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Task Updated Successfully",
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(errorHandler(400, "Status cannot be empty"));
  }

  try {
    const task = await TaskModel.findById(req.params.taskId);
    if (!task) {
      return next(errorHandler(404, "Task not found"));
    }

    if (req.user.id != task.userId) {
      return next(errorHandler(401, "You are not allowed to edit this task"));
    }

    const updatedStatus = await TaskModel.findByIdAndUpdate(
      req.params.taskId,
      {
        $set: {
          status,
        },
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Task Updated Successfully",
      task: updatedStatus,
    });
  } catch (error) {
    next(error);
  }
};
