const { userData, itemData, categoryData } = require("../db/data/test/");
const { db } = require("../db/connection");
const seed = require("../db/seed/seed");
const request = require("supertest");
const app = require("../app");
const { describe } = require("node:test");

beforeAll(() => seed(userData, categoryData, itemData));

afterAll(() => db.close());

describe("GET /api/users", () => {
  it("200: should return an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(3);
        users.forEach((user) => {
          expect(user).toMatchObject({
            location: expect.any(Object),
            _id: expect.any(String),
            username: expect.any(String),
            password: expect.any(String),
            salt: expect.any(String),
            contact: expect.any(String),
            __v: expect.any(Number),
          });
        });
      });
  });
  it("404: should return path not found if passed a valid but non-existant path", () => {
    return request(app)
      .get("/api/notusers")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/users/:username", () => {
  it("200: should respond with the user object with the correct keys and values", () => {
    return request(app)
      .get("/api/users/Janet876")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual({
          username: "Janet876",
          password:
            "dffe4b88d705ab1518171786f4199105e0099aa62621613d6707f7d3b0c09e4c", //"Lancaster21",
          salt: "cf1ecce6f08d5f583500d3aea18c494b",
          _id: expect.any(String),
          location: {
            latitude: 50.805832, // Portsmouth
            longitude: -1.087222,
          },
          contact: "07563421234",
          __v: 0,
        });
      });
  });
  it("404: should respond with a msg if passed a user that does not exist", () => {
    return request(app)
      .get("/api/users/chocolate")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
  it('404: should respond with "Path not found" if passed a valid but non-existant path', () => {
    return request(app)
      .get("/api/usrs/Janet876")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("POST /api/users", () => {
  it("201: should respond with the newly created user object", () => {
    const newUser = {
      username: "Jake",
      password: "Mango1998",
      location: {
        latitude: 52.916668, // Derby
        longitude: -1.466667,
      },
      contact: "07934567890",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual({
          __v: 0,
          _id: expect.any(String),
          username: "Jake",
          password: expect.any(String),
          salt: expect.any(String),
          location: {
            latitude: 52.916668, // Derby
            longitude: -1.466667,
          },
          contact: "07934567890",
        });
      });
  });
  it("201: should ignore any additional properties passed", () => {
    const newUser = {
      _id: 500,
      username: "David",
      password: "Mango1998",
      location: {
        latitude: 52.916668, // Derby
        longitude: -1.466667,
      },
      contact: "07934567890",
    };

    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual({
          __v: 0,
          _id: expect.any(String),
          username: "David",
          password: expect.any(String),
          salt: expect.any(String),
          location: {
            latitude: 52.916668, // Derby
            longitude: -1.466667,
          },
          contact: "07934567890",
        });
      });
  });
  it("400: should respond with a msg if passed a username that already exists", () => {
    const newUser = {
      username: "David",
      password: "bluepeter",
      location: {
        latitude: 52.916668, // Derby
        longitude: -1.466667,
      },
      contact: "07934567865",
    };

    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request username already exists");
      });
  });
  it("404: should respond with  path not found if passed a valid but non existent path", () => {
    const newUser = {
      username: "Alex",
      password: "bluepeter",
      location: {
        latitude: 52.916668, // Derby
        longitude: -1.466667,
      },
      contact: "07934567865",
    };

    return request(app)
      .post("/api/usrs")
      .send(newUser)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/items", () => {
  it("200: should respond with an array of item objects", () => {
    return request(app)
      .get("/api/items")
      .expect(200)
      .then(({ body }) => {
        const { items } = body;

        expect(items).toBeInstanceOf(Object);
        expect(items).toHaveLength(2);
        items.forEach((item) => {
          expect(item).toMatchObject({
            name: expect.any(String),
            category: expect.any(String),
            description: expect.any(String),
            username: expect.any(String),
            location: {
              latitude: expect.any(Number),
              longitude: expect.any(Number),
            },
            expiry_date: expect.any(String),
            quantity: expect.any(Number),
            item_url: expect.any(String),
            is_available: expect.any(Boolean),
          });
        });
      });
  });
  it("404: should respond with a 4040Path not found message if the path is invalid (ie mispelled)", () => {
    return request(app)
      .get("/api/itemsjkdbgearjhgh3")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("POST /api/items", () => {
  it("201: should respond with the newly created item object", () => {
    const newItem = {
      name: "bananas",
      category: "Fruits and veggies",
      description: "some lovely bananas",
      username: "John34",
      location: { latitude: 10, longitude: 10 },
      expiry_date: "some date",
      is_available: "true",
      quantity: 1,
    };
    return request(app)
      .post("/api/items")
      .send(newItem)
      .expect(201)
      .then(({ body }) => {
        const { item } = body;
        expect(item).toEqual({
          name: "bananas",
          description: "some lovely bananas",
          location: { latitude: 10, longitude: 10 },
          expiry_date: "some date",
          is_available: true,
          quantity: 1,
          category: expect.any(String),
          username: expect.any(String),
          _id: expect.any(String),
          __v: expect.any(Number),
        });
      });
  });
  it("201: newly posted items should be available", () => {
    const newItem = {
      name: "apples",
      category: "Fruits and veggies",
      description: "some lovely apples",
      username: "John34",
      location: { latitude: 10, longitude: 10 },
      expiry_date: "some date",
      quantity: 1,
      is_available: "false",
    };
    return request(app)
      .post("/api/items")
      .send(newItem)
      .expect(201)
      .then(({ body }) => {
        const { item } = body;
        expect(item.is_available).toBe(true);
      });
  });
  it("201: should default a new items location to the users location if no location provided", () => {
    const newItem = {
      name: "carrots",
      category: "Fruits and veggies",
      description: "some lovely carrots",
      username: "John34",
      expiry_date: "some date",
      quantity: 1,
      is_available: "true",
    };
    return request(app)
      .post("/api/items")
      .send(newItem)
      .expect(201)
      .then(({ body }) => {
        const { item } = body;
        expect(item.location).toEqual({
          latitude: 52.916668,
          longitude: -1.466667,
        });
      });
  });
  it("201: should ignore superfluous keys", () => {
    const newItem = {
      name: "carrots",
      category: "Fruits and veggies",
      description: "some lovely carrots",
      superfluous: "this key is not required",
      username: "John34",
      expiry_date: "some date",
      quantity: 1,
      is_available: "true",
    };
    return request(app)
      .post("/api/items")
      .send(newItem)
      .expect(201)
      .then(({ body }) => {
        const { item } = body;
        expect(item).not.toHaveProperty("superfluous");
      });
  });
  it("404: should respond with a 404 if username does not exist ", () => {
    const newItem = {
      name: "bananas",
      category: "Fruits and veggies",
      description: "some lovely bananas",
      username: "John",
      location: { latitude: 10, longitude: 10 },
      expiry_date: "some date",
      quantity: 1,
      is_available: "true",
    };
    return request(app)
      .post("/api/items")
      .send(newItem)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("User not found");
      });
  });
  it("404: should respond with a 404 if category does not exist ", () => {
    const newItem = {
      name: "bananas",
      category: "Fruit and veggies",
      description: "some lovely bananas",
      username: "John34",
      location: { latitude: 10, longitude: 10 },
      expiry_date: "some date",
      quantity: 1,
      is_available: "true",
    };
    return request(app)
      .post("/api/items")
      .send(newItem)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Category not found");
      });
  });
  it("400: new items require a name", () => {
    const newItem = {
      category: "Fruits and veggies",
      description: "some lovely fruit",
      username: "John34",
      location: { latitude: 10, longitude: 10 },
      expiry_date: "some date",
      quantity: 1,
      is_available: "true",
    };
    return request(app)
      .post("/api/items")
      .send(newItem)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request - name is required");
      });
  });
  it("400: new items require an expiry_date", () => {
    const newItem = {
      name: "fruit",
      category: "Fruits and veggies",
      description: "some lovely fruit",
      username: "John34",
      location: { latitude: 10, longitude: 10 },
      quantity: 1,
      is_available: "true",
    };
    return request(app)
      .post("/api/items")
      .send(newItem)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request - expiry_date is required");
      });
  });
  it("400: new items require a quantity", () => {
    const newItem = {
      name: "fruit",
      category: "Fruits and veggies",
      description: "some lovely fruit",
      username: "John34",
      location: { latitude: 10, longitude: 10 },
      expiry_date: "some date",
      is_available: "true",
    };
    return request(app)
      .post("/api/items")
      .send(newItem)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request - quantity is required");
      });
  });
});
