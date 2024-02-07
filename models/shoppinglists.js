const mongoose = require("mongoose");

const shoppingListSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 50,
    },
  },
  { timestamps: true }
);

// const shoppingListSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     maxLength: 50,
//     minLength: 3,
//     timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
//     notes: [{ text: String }],
//   },
//   //{ timestamps: true },
// });

module.exports = mongoose.model("ShoppingLists", shoppingListSchema);
