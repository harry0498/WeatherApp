const express = require("express");
const rateLimit = require("express-rate-limit");
const weatherRouter = require("./routes/weather");

const app = express();

// Set up rate limiter
const limiter = rateLimit({
  windowMs: 300 * 1000,
  max: 20,
  message: '{"message": "Too many requests"}',
});


// Apply the rate limiter
app.use(limiter);

// Use the weather router
app.use("/api", weatherRouter);

// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
