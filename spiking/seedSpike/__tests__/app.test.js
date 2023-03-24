const testUserData = require("../data/test/users");
const seed = require("../seeds/seed");
const db = require("../connection");

beforeEach(() => seed(testUserData));

afterAll(() => {
  db.close();
});

describe("Test reseeding function", () => {
  it("Should reseed the database before each test", () => {
    db.dropCollection("snacks");
    expect("s").toBe("s");
  });
});
