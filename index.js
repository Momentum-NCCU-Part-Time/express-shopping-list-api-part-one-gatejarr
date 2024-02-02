require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const port = process.env.PORT;

// Mongoose Connection
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.once("open", () => console.log("🦈 Connected to MongoDB"));


const app = express();
app.use(morgan("dev"));
app.use(express.json());

// Models
const AllLists = require('./models/AllLists')

app.get('/alllists', (req, res) => {
  AllLists.find().then((results) => res.status(200).json(results))
})

app.listen(port, () =>
  console.log(`Application is running on port ${port}`)
);
