const { userData, itemData, categoryData } = require("../db/data/dev/");
const { db } = require("../connection");
import seed from "../seed/seed";

const runSeed = () => {
  return seed(userData, itemData, categoryData).then(() => db.close());
};
runSeed();
