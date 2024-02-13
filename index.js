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
const ShoppingLists = require("./models/ShoppingLists");

// GET all lists WORKING
app.get("/shoppinglists", (req, res) => {
  ShoppingLists.find().then((results) => res.status(200).json(results));
});

// GET individual list with ID WORKING
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

// POST new list WORKING
app.post("/shoppinglists", (req, res) => {
  const newList = new ShoppingLists(req.body);
  newList.save();
  res.status(201).json(newList);
});

// POST to add items WORKING
app.post("/shoppinglists/:listId/items", (req, res) => {
  ShoppingLists.findById(req.params.listId)
    .then((shoppinglist) => {
      if (shoppinglist) {
        shoppinglist.items.push(req.body.items);
        shoppinglist.save();
        res.status(201).json(shoppinglist);
      } else {
        res.status(404).json({ message: "List not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad Request" }));
});

// PATCH update list, WIP
app.patch("/shoppinglists/:listId", (req, res) => {
  ShoppingLists.findById(req.params.listId)
    .then((shoppinglist) => {
      if (shoppinglist) {
        shoppinglist.title = req.body.title || shoppinglist.title;
        shoppinglist.save();
        res.status(200).json(shoppinglist);
      } else {
        res.status(404).json({ message: "not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad Patch Request" }));
});

// DELETE list WORKING
app.delete("/shoppinglists/:listId", (req, res) => {
  ShoppingLists.findByIdAndDelete(req.params.listId)
    .then((shoppinglist) => {
      if (shoppinglist) {
        res.status(200).json({ deleted: shoppinglist });
      } else {
        res.status(404).json({ message: "List not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad Delete Request " }));
});

// DELETE item with list & item ID WORKING
app.delete("/shoppinglists/:listId/items/:itemId", (req, res) => {
  ShoppingLists.findById(req.params.listId)
    .then((shoppinglist) => {
      if (shoppinglist) {
        shoppinglist.items.id(req.params.itemId).deleteOne();
        shoppinglist.save();
        res.status(200).json(shoppinglist);
      } else {
        res.status(400).json({ message: "Item not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad Requst" }));
});

app.listen(port, () => console.log(`Application is running on port ${port}`));
