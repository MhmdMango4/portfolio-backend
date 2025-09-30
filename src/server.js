const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const serviceRoutes = require("./routes/serviceRoutes");
const contactRoutes = require("./routes/contactRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/contact", contactRoutes);

app.get("/", (req, res) => {
  res.send("Portfolio Backend is live!");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
