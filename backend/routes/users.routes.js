const express = require("express");

const {
  validateLogin,
  validateRegister,
  authenticateUser,
  // authorizeUser,
} = require("../middleware/users.middleware");
const {
  userLogin,
  userRegister,
  // getUsers,
  getUserById,
  updateUser,
  // deleteUser,
  logoutUser,
} = require("../controller/users.controller");

const usersRouter = express.Router();

usersRouter.post("/login", validateLogin, userLogin);

usersRouter.post("/register", validateRegister, userRegister);

// usersRouter.get("/user", authenticateUser, getUsers);

usersRouter.get("/user", authenticateUser, getUserById);

usersRouter.patch("/updateProfile", authenticateUser, updateUser);

// usersRouter.delete("/user/:id", authenticateUser, authorizeUser, deleteUser);

usersRouter.post("/logout", logoutUser);

usersRouter.all("*", (req, res) => {
  return res.status(404).json({ error: true, message: "404 Invalid Route" });
});

module.exports = { usersRouter };
