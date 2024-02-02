require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.once("open", () => console.log("🦈 Connected to MongoDB"));

const port = process.env.port;

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.listen(port, () =>
  console.log(`🐷 Application is running on port ${port}`)
);
