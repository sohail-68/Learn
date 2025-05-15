require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

const app = express(); // ✅ Define app

connectDB();
app.use(express.json());
app.use(cors());

// Health check route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
