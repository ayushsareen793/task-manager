const express = require("express");
const { body } = require("express-validator");
const protect = require("../middleware/authMiddleware");
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

// every route below requires a valid JWT
router.use(protect);

const taskValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Status must be Pending, In Progress or Completed"),
  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority must be Low, Medium or High"),
];

router.route("/").get(getTasks).post(taskValidation, createTask);
router.route("/:id").get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
