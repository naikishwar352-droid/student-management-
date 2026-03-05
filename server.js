const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const studentRouter = require("./routes/studentRouter");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Student API running");
});

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

app.use("/users", studentRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log(`Server running on ${PORT}`));