require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dayjs = require("dayjs");
dayjs().format();

const port = process.env.PORT;

// Mongoose Connection
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.once("open", () => console.log("🦈 Connected to MongoDB"));

const app = express();
app.use(morgan("dev"));
app.use(express.json());

// Models
const ShoppingLists = require("./models/shoppinglists");

// GET all lists
app.get("/shoppinglists", (req, res) => {
  ShoppingLists.find().then((results) => res.status(200).json(results));
});

// POST new list
app.post("/shoppinglists", (req, res) => {
  const newList = new ShoppingLists(req.body);
  newList.save();
  res.status(201).json(newList);
});

// GET with ID
app.get("/shoppinglists/:listId", (req, res) => {
  ShoppingLists.findById(req.params.listId)
    .then((results) => {
      if (results) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "List not found" });
      }
    })
    .catch((error) =>
      res.status(400).json({ message: "Bad Request, list not found" })
    );
});

// PATCH update list, WIP
app.patch("/shoppinglists/:listId", (req, res) => {
  List.findById(req.params.listId)
    .then((list) => {
      if (list) {
        list.title = req.body.title || list.title;
        list.url = req.body.url || list.url;
        list.save();
        res.status(200).json(list);
      } else {
        res.status(404).json({ message: "not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad Patch Request" }));
});

// DELETE not working
app.delete("/shoppinglists/:listId", (req, res) => {
  ShoppingLists.findById(req.params.listId);
});

app.listen(port, () => console.log(`Application is running on port ${port}`));
