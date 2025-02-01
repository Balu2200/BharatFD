const express = require("express");
const { connectDb } = require("./configure/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:5173"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const { adminMiddleware } = require("./middlewares/checkadmin");

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/admin", adminMiddleware, adminRouter);

const port = process.env.SERVER_PORT || 3000;
connectDb()
  .then(() => {
    console.log("✅ Database Connected");
    app.listen(port, () => {
      console.log(`🚀 Server started on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database Connection Error:", err.message);
  });
