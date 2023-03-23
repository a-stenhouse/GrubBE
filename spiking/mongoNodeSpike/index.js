const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri =
  "mongodb+srv://jamesmilmine:UWkzGITgOAfbXtTD@cluster0.seq9c2f.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

function createAnEntry() {
  const newEntry = { name: "banana", quantity: 10 };

  const database = client.db("test_db");
  const snacks = database.collection("snacks");

  snacks
    .insertOne(newEntry)
    .then((response) => console.log(response))
    .finally(() => client.close());
}

function readAnEntry() {
  // get the pineapple entry and display quantity
  const database = client.db("test_db");
  const snacks = database.collection("snacks");

  const query = { name: "pineapple" };
  snacks
    .findOne(query)
    .then((response) => console.log(response.quantity))
    .finally(() => client.close());
  // the client.close is called to close the connection to the mongodb server
}

function readEntries() {
  // show all the entries where quantity is greater than 4 and less than 10
  const database = client.db("test_db");
  const snacks = database.collection("snacks");
  snacks
    .find({ quantity: { $gt: 4, $lt: 10 } })
    .toArray()
    .then((res) => console.log(res))
    .finally(() => client.close());
}

function updateAnEntry() {
  // change pineapple quantity to 15
  const database = client.db("test_db");
  const snacks = database.collection("snacks");
  snacks
    .updateOne({ name: "pineapple" }, { $set: { quantity: 15 } })
    .then((res) => console.log(res))
    .finally(() => client.close());
}

function deleteAnEntry() {
  // remove one of the bananas (with quantity 10)
  const database = client.db("test_db");
  const snacks = database.collection("snacks");

  snacks
    .deleteOne({ name: "banana", quantity: 10 })
    .then((res) => console.log(res))
    .finally(() => client.close());
}

readAnEntry();
