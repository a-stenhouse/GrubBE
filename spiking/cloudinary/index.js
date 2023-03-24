const cloudinary = require("cloudinary").v2;
const config = require("./cloudinaryConfig");

cloudinary.config(config);

// upload a file

cloudinary.uploader
  .upload(`${__dirname}/mongodb.gif`, { public_id: "mongodb_logo" })
  .then(({ url }) => console.log(url));
