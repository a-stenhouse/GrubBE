const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

module.exports = [
  {
    _id: new ObjectId("56cb91bdc3464f14678934ca"),
    name: "bananas",
    category: "Fruits and veggies",
    description: "ready to eat bananas",
    username: "John34",
    location: {
      type: "Point",
      coordinates: [-1.466667, 52.916668],
    },
    expiry_date: new Date("2023-03-28"),
    quantity: 1,
    item_url:
      "https://res.cloudinary.com/dhirydfr8/image/upload/v1679924952/grepww2o8mwrdebpkbsx.webp",
    is_available: "true",
  },
  {
    _id: new ObjectId("61b0c4c065064fdfb889a141"),
    name: "Salmon",
    category: "Meat and Fish",
    description: "2 salmon fillets",
    username: "Mike20",
    location: {
      type: "Point",
      coordinates: [-2.58024, 53.39254],
    },
    expiry_date: new Date("2023-03-27"),
    quantity: "1",
    item_url:
      "https://res.cloudinary.com/dhirydfr8/image/upload/v1679925023/zncex1cjvxgyvrk4y3t5.jpg",
    is_available: "true",
  },
  {
    name: "Bread",
    category: "Grains",
    description: "2 loaves of bread",
    username: "Mike20",
    location: {
      type: "Point",
      coordinates: [-2.67249, 53.35278],
    },
    expiry_date: new Date("2023-03-27"),
    quantity: "1",
    item_url:
      "https://res.cloudinary.com/dhirydfr8/image/upload/v1679925023/zncex1cjvxgyvrk4y3t5.jpg",
    is_available: "true",
  },
  {
    name: "Beer",
    category: "Beverages",
    description: "6 pack of lager",
    username: "Mike20",
    location: {
      type: "Point",
      coordinates: [-2.5274, 53.37105],
    },
    expiry_date: new Date("2023-03-27"),
    quantity: "1",
    item_url:
      "https://res.cloudinary.com/dhirydfr8/image/upload/v1679925023/zncex1cjvxgyvrk4y3t5.jpg",
    is_available: "true",
  },
];
