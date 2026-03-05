const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true   // Unique constraint (DBMS concept)
  },
  department: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);