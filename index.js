const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const commentRoutes = require("./routes/commentRoutes");
const verifyToken = require("./middleware/verifyToken");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
const cors = require("cors");
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://insta-api-login.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/profile", verifyToken, profileRoutes);
app.use("/api/comments", verifyToken, commentRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the EmpathyTech API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
