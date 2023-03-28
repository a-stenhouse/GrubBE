const Item = require("../db/Item")

exports.fetchItems = () => {
    return Item.find()
}