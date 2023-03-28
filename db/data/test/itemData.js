const mongoose = require("mongoose");
const {ObjectId} = require("mongodb")

module.exports = [
  {
    _id: new ObjectId('56cb91bdc3464f14678934ca'),
    name: "bananas",
    category: "Fruits and veggies",
    description: "ready to eat bananas",
    username: "John34",
    location: {
      latitude: 52.916668,
      longitude: -1.466667,
    },
    expiry_date: "29/3/2023",
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
      latitude: 53.39254,
      longitude: -2.58024,
    },
    expiry_date: "29/3/2023",
    quantity: "1",
    item_url:
      "https://res.cloudinary.com/dhirydfr8/image/upload/v1679925023/zncex1cjvxgyvrk4y3t5.jpg",
    is_available: "true",
  },
];
