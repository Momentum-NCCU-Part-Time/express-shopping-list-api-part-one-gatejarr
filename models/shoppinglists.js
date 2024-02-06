const mongoose = require("mongoose");

const shoppingListSchema = new mongoose.Schema({
  title: String,
});

module.exports = mongoose.model("ShoppingLists", shoppingListSchema);
