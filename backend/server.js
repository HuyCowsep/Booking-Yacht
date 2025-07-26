const express = require("express");
const connectDB = require("./config/db");
const { json, urlencoded } = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandles");
const router = require("./routers/index");
require("./utils/bookingCleanupJob");

const app = express();

// Connect Database
connectDB();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Pragma",
    ],
  })
);
app.use(express.json());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));

// Phục vụ file tĩnh từ thư mục uploads
app.use("/uploads", express.static("uploads"));

// Custom router từ file index.js
router(app);

// Error handler (nên đặt ở cuối)
app.use(errorHandler);

const PORT = process.env.PORT || 9999;

app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
