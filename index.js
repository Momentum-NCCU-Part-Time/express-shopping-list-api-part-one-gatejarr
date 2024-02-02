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

app.post('/alllists', (req, res) => {
  const newList = new List(req.body)
  newList.save()
  res.status(201).json(newList)
})

app.get('/alllists/:listId', (req, res) => {
  List.findById(req.params.listId)
  .then((results) => {
    if (results) {
      res.status(200).json(results)
    } else {
      res.status(404).json({ message: 'not found' })
    }
  }) .catch((error) => res.status(400).json({ message: 'Bad Request'}))
})

app.patch('/alllists/:listId', (req, res) => {
  List.findById(req.params.listId)
    .then((list) => {
      if (list) {
        list.title = req.body.title || list.title
        list.url = req.body.url || list.url
        list.save()
        res.status(200).json(list)
      } else {
        res.status(404).json({ message: 'not found' })
      }
    }) .catch((error) => res.status(400).json({ message: 'Bad Request'}))
})

app.delete('/alllists/:listId', (req, res) => {
  List.findById(req.params.listId)
})

app.listen(port, () =>
  console.log(`Application is running on port ${port}`)
);
