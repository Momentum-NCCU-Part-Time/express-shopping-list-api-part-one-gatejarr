const mongoose = require("mongoose");

const shoppingListSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 50,
      minLength: 3,
    },
    items: [{ type: new mongoose.Schema({
      item: String,
      quantity: Number,
      purchased: Boolean,
    },
    { timestamps: true })
  }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShoppingLists", shoppingListSchema);
