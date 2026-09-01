const { validationResult } = require("express-validator");
const Task = require("../models/Task");

//get request
exports.getTasks = async (req, res, next) => {
  try {
    const filter = { userId: req.userId };

    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: "i" };
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
};

// @route  GET request
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Ownership check - a task existing isn't enough, it must belong to this user
    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Not authorized to access this task" });
    }

    return res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      userId: req.userId,
    });

    return res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Not authorized to update this task" });
    }

    const { title, description, status, priority, dueDate } = req.body;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.dueDate = dueDate ?? task.dueDate;

    await task.save(); // triggers schema validation (enum checks etc.)

    return res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this task" });
    }

    await task.deleteOne();

    return res.status(200).json({ success: true, message: "Task deleted", data: { id: req.params.id } });
  } catch (err) {
    next(err);
  }
};
