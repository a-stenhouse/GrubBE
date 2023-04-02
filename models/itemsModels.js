const Item = require("../db/Item");
const { at } = require("../db/data/test/categoryData");

const coordinateCheck = (latitude, longitude) => {
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    return false;
  }
  return true;
};

exports.fetchItems = (page = 0, limit = 100) => {
  if (isNaN(Number(page)) || isNaN(Number(limit))) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }
  page = Number(page);
  limit = Number(limit);
  return Item.find()
    .skip(page * limit)
    .limit(limit);
};

exports.fetchItemsByLocation = (
  lat,
  long,
  range = 8046,
  asc = 1,
  page = 0,
  limit = 100
) => {
  page = Number(page);
  limit = Number(limit);
  range = Number(range);
  if (isNaN(page) || isNaN(limit) || isNaN(range)) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }
  if (!coordinateCheck(lat, long)) {
    return Promise.reject({ status: 400, msg: "Coordinate out of bounds" });
  }
  return Item.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [Number(long), Number(lat)] },
        spherical: true,
        distanceField: "distance",
        maxDistance: range,
      },
    },
    {
      $sort: { distance: asc },
    },
  ])
    .skip(page * limit)
    .limit(limit);
};

exports.fetchItemsByArea = (lat1, long1, lat2, long2) => {
  if (!coordinateCheck(lat1, long1) || !coordinateCheck(lat2, long2)) {
    return Promise.reject({ status: 400, msg: "Coordinate out of bounds" });
  }
  return Item.find({
    location: {
      $geoWithin: {
        $box: [
          [long1, lat1],
          [long2, lat2],
        ],
      },
    },
  });
};

exports.removeItem = (_id) => {
  return Item.findByIdAndDelete({ _id }).then((deletedItem) => {
    if (!deletedItem) {
      return Promise.reject({
        status: 404,
        msg: "Item not found",
      });
    } else {
      return deletedItem;
    }
  });
};

exports.fetchItemById = (_id) => {
  return Item.findOne({ _id }).then((item) => {
    if (!item) {
      return Promise.reject({
        status: 404,
        msg: "Item not found",
      });
    }
    return item;
  });
};

exports.postNewItem = (newItem) => {
  const itemToInsert = new Item(newItem);
  return itemToInsert.save();
};
