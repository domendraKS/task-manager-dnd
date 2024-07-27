import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import authRoute from "./routes/user.route.js";
import taskRoute from "./routes/task.route.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://task-manager-dnde.netlify.app/",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE","PUT"],
  })
);

app.listen(process.env.PORT, () => {
  DB_CONN();
  console.log(`Server is running on port ${process.env.PORT}.`);
});

const DB_CONN = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((res) => console.log("MongoDB is connected."))
    .catch((error) => console.log(error));
};

//routes
app.use("/api/auth", authRoute);
app.use("/api/task", taskRoute);

//error-handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({ success: false, message });
});
