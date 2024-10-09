require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const httpStatusText = require("./utils/httpStatusText");

const url = process.env.MONGO_URL;
const coursesRouter = require("./routes/courses.routes");
const usersRouter = require("./routes/users.routes");

app.use(cors());
app.use(express.json());

mongoose
  .connect(url)
  .then(() => {
    console.log("MongoDB server started");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// Routing
app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);

app.all("*", (req, res) => {
  return res.status(404).json({
    status: httpStatusText.ERROR,
    message: "NOT FOUND",
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const statusText = err.statusText || httpStatusText.ERROR;

  res.status(statusCode).json({
    status: statusText,
    message: err.message || "Internal Server Error",
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`The server is running on port: ${process.env.PORT || 5000}`);
});
