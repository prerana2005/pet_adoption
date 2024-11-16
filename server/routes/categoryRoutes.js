const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

//get all categories
//get all media
router.get("/all", categoryController.getAll);

//create new category
//post create new media
router.post("/create", categoryController.create);

//update a category
//post create new media
router.put("/update/:id", categoryController.update);

//delete a category
router.delete("/delete/:id", categoryController.delete);

module.exports = router;