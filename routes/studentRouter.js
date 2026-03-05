const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  department: String,
  cgpa: Number
});

const User = mongoose.model("User", userSchema);

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new user
router.post("/", async (req, res) => {
  const user = new User(req.body);

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;