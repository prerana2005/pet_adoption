const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {  //whatever you want to store in database should be passed here      
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Category = mongoose.model('Category', CategorySchema);