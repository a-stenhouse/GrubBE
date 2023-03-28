const { userData, itemData, categoryData } = require("../data/development/");
const { db } = require("../connection");
const seed = require("../seed/seed");

const runSeed = () => {
  return seed(userData, categoryData, itemData).then(() => db.close());
};
runSeed();
