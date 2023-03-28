const { userData, itemData, categoryData } = require("../db/data/test/");
const { db } = require("../db/connection");
const seed = require("../db/seed/seed");
const request = require("supertest");
const app = require("../app");

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
            _id: expect.any(String),
            __v: 0,
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

describe("GET /api/items", () => {
  it("200: should respond with an array of item objects", () => {
    return request(app)
      .get("/api/items")
      .expect(200)
      .then(({ body }) => {
        const { items } = body;

        expect(items).toBeInstanceOf(Object);
        items.forEach((item) => {
          expect(item).toMatchObject({
            _id: expect.any(String),
            __v: 0,
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

describe("GET /api/items/:_id", () => {
  it("200: should respond with a single item object", () => {
    return request(app)
    .get("/api/items/56cb91bdc3464f14678934ca")
    .expect(200)
    .then(({body}) => {
      expect(body.item).toEqual({
        "location": {
          "latitude": 52.916668,
          "longitude": -1.466667
        },
        _id: "56cb91bdc3464f14678934ca",
        name: "bananas",
        category: expect.any(String),
        description: "ready to eat bananas",
        username: expect.any(String),
        expiry_date: "29/3/2023",
        quantity: 1,
        item_url: "https://res.cloudinary.com/dhirydfr8/image/upload/v1679924952/grepww2o8mwrdebpkbsx.webp",
        is_available: true,
        __v: 0
      })
    })
  })
  it("404: should respond with a 404 Not found error message if the passed _id is valid but non-existent", () => {
    return request(app)
    .get("/api/items/56cb91bdc3222f14678934ca")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Item not found")
    })
  })
})