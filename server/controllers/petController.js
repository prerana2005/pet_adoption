const Pet = require('../models/Pet');
const fs = require('fs');
const path = require('path');

exports.getAll = async (req, res) => {
  try {
    const pets = await Pet.find().populate("category");

    res.json(pets);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id).populate("category");

    res.json(pet);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.getByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const pets = await Pet.find({ category: categoryId }).populate("category");

    res.json(pets);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.create = async (req, res) => {
  try {
    console.log(req.files);
    const { name, age, breed, color, description, imageLabel, category } =
      req.body;
    const { image, additionalImages } = req.files;

    let imagePath = '';
    let additionalImagesPaths = [];

    if(image && image.length > 0) {
        imagePath = image[0].path;
    }

    if(additionalImages && additionalImages.length > 0) {
        additionalImagesPaths = additionalImages.map(file => file.path);
    }
    // if (req.files.image && req.files.image.length > 0) {
    //   imagePath = image[0].path;
    // }

    // if (req.files.additionalImages && req.files.additionalImages.length > 0) {
    //   additionalImagesPaths = additionalImages.map((file) => file.path);
    // }

    const createdPet = await Pet.create({
      name,
      age,
      breed,
      color,
      description,
      imageLabel,
      category,
      image: imagePath,
      additionalImages: additionalImagesPaths,
    });

    res.json({ message: "Pet created successfully.", createdPet });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, breed, color, description, imageLabel, category } =
      req.body;
    const { image, additionalImages } = req.files;

    let imagePath = "";
    let additionalImagesPaths = [];
    if (req.files.image && req.files.image.length > 0) {
      imagePath = image[0].path;
    }

    if (
      Array.isArray(req.files.additionalImages) &&
      req.files.additionalImages.length > 0
    ) {
      additionalImagesPaths = additionalImages.map((file) => file.path);
    }

    const existingPet = await Pet.findById(id);
    console.log(existingPet.additionalImages);

    if (additionalImagesPaths.length === 0) {
      additionalImagesPaths = existingPet.additionalImages;
    } else if (
      Array.isArray(existingPet.additionalImages) &&
      existingPet.additionalImages.length > 0
    ) {
      console.log(existingPet.additionalImages);
      await Promise.all(
        existingPet.additionalImages.map(
          async (img) =>
            await fs.unlink(path.join(__dirname, "../", img), (err, res) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Files deleted successfuly");
              }
            })
        )
      )
        .then(console.log)
        .catch(console.log);
    }

    if (imagePath.length === 0) {
      imagePath = existingPet.image;
    } else {
      await fs.unlink(existingPet.image, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          return;
        }
      });
    }

    const updatedPet = await Pet.findByIdAndUpdate(
      id,
      {
        name,
        age,
        breed,
        color,
        description,
        imageLabel,
        category,
        image: imagePath,
        additionalImages: additionalImagesPaths,
      },
      { new: true }
    );

    res.json({ message: "Pet updated successfully.", updatedPet });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const existingPet = await Pet.findById(id);

    if(!existingPet) {
        return res.status(404).json({message: 'Record does not exist'});
    }
    const deletedpet = await Pet.findByIdAndRemove(id);

    res.json({ message: "Pet successfuly deleted", deletedpet });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}; 