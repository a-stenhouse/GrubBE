const cloudinary = require("cloudinary").v2;
const config = require("./cloudinaryConfig");
const fs = require("fs/promises");
const { readdir } = require("fs");

cloudinary.config(config);

// upload a file

cloudinary.uploader
  .upload(`${__dirname}/mongodb.gif`, { public_id: "mongodb_logo" })
  .then(({ url }) => console.log(url));
