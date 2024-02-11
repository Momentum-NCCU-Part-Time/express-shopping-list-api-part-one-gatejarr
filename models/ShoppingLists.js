const mongoose = require("mongoose");

// const itemsSchema = new mongoose.Schema(
//   {
//     items: [
//       {
//         item: String,
//         quantity: Number,
//         purchased: Boolean,
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const shoppingListSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       maxLength: 50,
//       minLength: 3,
//     },
//     items: [itemsSchema],
//   },
//   { timestamps: true }
// );

const shoppingListSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 50,
      minLength: 3,
    },
    items: [{ item: String, quantity: Number, purchased: Boolean }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShoppingLists", shoppingListSchema);
