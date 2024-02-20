require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.PORT;

// Mongoose Connection
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.once("open", () => console.log("🦇 👨 Connected to MongoDB"));

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

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

// PATCH to add items to list from front end
app.patch("/shoppinglists/:listId/items", (req, res) => {
  ShoppingLists.findById(req.params.listId).then((shoppinglist) => {
    if (shoppinglist) {
      shoppinglist.title = req.body.title || shoppinglist.title
      shoppinglist.updatedAt = req.body.updatedAt
      shoppinglist.items = req.body.items
      shoppinglist.save()
      res.status(200).json(shoppinglist)
    } else {
      res.status(404).json({ message: "Not Found"})
    }
  })
  .catch((error) => res.status(404).json({ message: "Bad Request"}))
})

// PATCH update list title WORKING
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

// PATCH to update individual items WIP; 
// "purchased": can be changed to true, but not changed back;
// If item is added as "purchased": true it cannot be changed to false
app.patch("/shoppinglists/:listId/items/:itemId", (req, res) => {
  ShoppingLists.findById(req.params.listId).then((shoppinglist) => {
    if (!shoppinglist) {
      res.status(400).json({ message: "List not found" })
    } else {
      const item = shoppinglist.items.id(req.params.itemId)
        if (!item) {
          res.status(400).json ({ message: "Item not found" })
        } else {
          const { name, quantity, purchased } = req.body
          item.name = name || item.name
          item.quantity = quantity || item.quantity
          item.purchased = purchased || item.purchased
          shoppinglist.save()
          .then(() => res.status(201).json(item))
          .catch((error) => res.status(404).json({ message: "Bad Request" }))
        }
    }
  })
  .catch((error) => res.status(404).json({ message: "Bad Request" }))
})

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
    .catch((error) => res.status(400).json({ message: "Bad Request" }));
});

app.listen(port, () => console.log(`Application is running on port ${port}`));
