const Item = require("../db/Item")

exports.fetchItems = () => {
    return Item.find()
}

exports.removeItem = (_id) => {
    return Item.findByIdAndDelete({ _id })
        .then((deletedItem) => {
            if (!deletedItem) {
                return Promise.reject({
                    status: 404,
                    msg: "Item not found"
                });
            } else {
                return deletedItem;
            }
        })
}

// {
//     type: Date,
//     expires: 0
//   }