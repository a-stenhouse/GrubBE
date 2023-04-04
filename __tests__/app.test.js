const { userData, itemData, categoryData } = require("../db/data/test/");
const { db } = require("../db/connection");
const seed = require("../db/seed/seed");
const request = require("supertest");
const app = require("../app");
const { describe } = require("node:test");
let token;

beforeAll(() =>
  seed(userData, categoryData, itemData).then(() => {
    const credentials = { username: "John34", password: "Bananas1995" };
    return request(app)
      .post("/api/auth")
      .send(credentials)
      .expect(200)
      .then(({ body }) => {
        token = body.token;
        return true;
      });
  })
);

afterAll(() => db.close());

describe("POST /api/auth", () => {
  it("401: should not authorize a user with an incorrect password", () => {
    const credentials = { username: "John34", password: "incorrect password" };
    return request(app)
      .post("/api/auth")
      .send(credentials)
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Incorrect username or password");
      });
  });
  it("401: should not authorize a user if no credentials are provided", () => {
    return request(app)
      .post("/api/auth")
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing credentials");
      });
  });
});

describe("GET /api/users/:username", () => {
  it("200: should respond with the user object with the correct keys and values", () => {
    return request(app)
      .get("/api/users/John34")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual({
          username: "John34",
          _id: expect.any(String),
          location: {
            type: "Point",
            coordinates: [-1.466667, 52.916668],
          },
          contact: "07922286099",
          __v: 0,
        });
      });
  });
  it("200: should not return the users password", () => {
    return request(app)
      .get("/api/users/John34")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).not.toHaveProperty("password");
      });
  });
  it("200: should not return the users salt", () => {
    return request(app)
      .get("/api/users/John34")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).not.toHaveProperty("salt");
      });
  });
  it("401: should not allow users to access endpoint without being authorised", () => {
    return request(app).get("/api/users/John34").expect(401);
  });
  it("404: should respond with a msg if passed a user that does not exist", () => {
    return request(app)
      .get("/api/users/chocolate")
      .set("Authorization", "Bearer " + token)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
  it('404: should respond with "Path not found" if passed a valid but non-existant path', () => {
    return request(app)
      .get("/api/usrs/Janet876")
      .set("Authorization", "Bearer " + token)
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
        type: "Point",
        coordinates: [-1.466667, 52.916668],
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
            type: "Point",
            coordinates: [-1.466667, 52.916668],
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
        type: "Point",
        coordinates: [-1.466667, 52.916668],
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
            type: "Point",
            coordinates: [-1.466667, 52.916668],
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
        type: "Point",
        coordinates: [-1.466667, 52.916668],
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
        type: "Point",
        coordinates: [-1.466667, 52.916668],
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
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .then(({ body }) => {
        const { items, total_items } = body;

        expect(items).toBeInstanceOf(Object);
        expect(items).toHaveLength(4);
        expect(total_items).toBe(4);
        items.forEach((item) => {
          expect(item).toMatchObject({
            name: expect.any(String),
            category: expect.any(Object),
            description: expect.any(String),
            user: expect.any(Object),
            location: {
              type: "Point",
              coordinates: [expect.any(Number), expect.any(Number)],
            },
            expiry_date: expect.any(String),
            quantity: expect.any(Number),
            item_url: expect.any(String),
            is_available: expect.any(Boolean),
          });
          expect(item.user).toMatchObject({
            username: expect.any(String),
            contact: expect.any(String),
          });
        });
      });
  });
  it("200: should accept a limit query and return the correct number of items", () => {
    return request(app)
      .get("/api/items?limit=2")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .then(({ body }) => {
        const { items, total_items } = body;
        expect(items).toHaveLength(2);
        expect(total_items).toBe(4);
      });
  });
  it("200: should accept a page query and return the correct page", () => {
    return request(app)
      .get("/api/items?limit=3&page=1")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .then(({ body }) => {
        const { items, total_items } = body;
        expect(items).toHaveLength(1);
        expect(total_items).toBe(4);
        expect(items[0].name).toBe("Beer");
        expect(items[0].description).toBe("6 pack of lager");
      });
  });
  it("400: should not accept a limit that is not a number", () => {
    return request(app)
      .get("/api/items?limit=two")
      .set("Authorization", "Bearer " + token)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid query");
      });
  });
  it("401: should not allow users to access endpoint without being authorised", () => {
    return request(app).get("/api/items/notauthorized").expect(401);
  });
  it("404: should respond with a 404 Path not found message if the path is invalid (ie mispelled)", () => {
    return request(app)
      .get("/api/itemsjkdbgearjhgh3")
      .set("Authorization", "Bearer " + token)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("GET: /api/items/:lat/:long", () => {
  it("200: should respond with a list of items sorted by distance, nearest first within 5 miles of location", () => {
    return request(app)
      .get("/api/items/53.41789/-2.56516")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .then(({ body }) => {
        const { items, total_items } = body;
        expect(items).toHaveLength(2);
        expect(total_items).toBe(2);
        expect(items[0].name).toBe("Salmon");
        expect(items[1].name).toBe("Beer");
      });
  });
  it("200: should accept a range query and return items within that range of the location", () => {
    return request(app)
      .get("/api/items/53.41789/-2.56516?range=10500")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .then(({ body }) => {
        const { items, total_items } = body;
        expect(items).toHaveLength(3);
        expect(total_items).toBe(3);
        expect(items[0].name).toBe("Salmon");
        expect(items[1].name).toBe("Beer");
        expect(items[2].name).toBe("Bread");
      });
  });
  it("200: should accept a desc query and return items furtherst away first", () => {
    return request(app)
      .get("/api/items/53.41789/-2.56516?desc=true")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .then(({ body }) => {
        const { items, total_items } = body;
        expect(items).toHaveLength(2);
        expect(total_items).toBe(2);
        expect(items[0].name).toBe("Beer");
        expect(items[1].name).toBe("Salmon");
      });
  });
  it("200: should accept page and limit queries and return the correct items", () => {
    return request(app)
      .get("/api/items/53.41789/-2.56516?range=10500&limit=2&page=1")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .then(({ body }) => {
        const { items, total_items } = body;
        expect(items).toHaveLength(1);
        expect(total_items).toBe(3);
        expect(items[0].name).toBe("Bread");
      });
  });
  it("400: should return an invalid latitude when latitude is out of bounds", () => {
    return request(app)
      .get("/api/items/153.41789/-2.56516")
      .set("Authorization", "Bearer " + token)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Coordinate out of bounds");
      });
  });
  it("400: should return an invalid longitude when longitude is out of bounds", () => {
    return request(app)
      .get("/api/items/53.41789/-200.56516")
      .set("Authorization", "Bearer " + token)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Coordinate out of bounds");
      });
  });
  it("400: should only accept numbers for limit queries", () => {
    return request(app)
      .get("/api/items/53.41789/-2.56516?limit=one")
      .set("Authorization", "Bearer " + token)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid query");
      });
  });
  it("400: should only accept numbers for page queries", () => {
    return request(app)
      .get("/api/items/53.41789/-2.56516?limit=1&page=one")
      .set("Authorization", "Bearer " + token)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid query");
      });
  });
  it("400: should only accept numbers for range queries", () => {
    return request(app)
      .get("/api/items/53.41789/-2.56516?range=1mile")
      .set("Authorization", "Bearer " + token)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid query");
      });
  });
});

describe("GET: /api/items/:lat1/:long1/:lat2/:long2", () => {
  it("200: should respond with an array of item objects that are within the bounds of the box", () => {
    return request(app)
      .get("/api/items/53.33548/-2.69983/53.42214/-2.49602")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .then(({ body: { items } }) => {
        expect(items).toHaveLength(3);
        expect(items[0].name).toBe("Salmon");
        expect(items[1].name).toBe("Bread");
        expect(items[2].name).toBe("Beer");
      });
  });
  it("400: should return out of bound if first coordinate is no valid", () => {
    return request(app)
      .get("/api/items/153.33548/-2.69983/53.42214/-2.49602")
      .set("Authorization", "Bearer " + token)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Coordinate out of bounds");
      });
  });
  it("400: should return out of bound if second coordinate is no valid", () => {
    return request(app)
      .get("/api/items/53.33548/-200.69983/53.42214/-2.49602")
      .set("Authorization", "Bearer " + token)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Coordinate out of bounds");
      });
  });
  it("400: should return out of bound if third coordinate is no valid", () => {
    return request(app)
      .get("/api/items/53.33548/-2.69983/153.42214/-2.49602")
      .set("Authorization", "Bearer " + token)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Coordinate out of bounds");
      });
  });
  it("400: should return out of bound if fourth coordinate is no valid", () => {
    return request(app)
      .get("/api/items/53.33548/-2.69983/53.42214/-200.49602")
      .set("Authorization", "Bearer " + token)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Coordinate out of bounds");
      });
  });
});

describe("GET /api/items/:_id", () => {
  it("200: should respond with a single item object", () => {
    return request(app)
      .get("/api/items/56cb91bdc3464f14678934ca")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .then(({ body }) => {
        expect(body.item).toEqual({
          location: {
            type: "Point",
            coordinates: [-1.466667, 52.916668],
          },
          _id: "56cb91bdc3464f14678934ca",
          name: "bananas",
          category: expect.any(Object),
          description: "ready to eat bananas",
          user: expect.any(Object),
          expiry_date: "2023-03-28T00:00:00.000Z",
          quantity: 1,
          item_url:
            "https://res.cloudinary.com/dhirydfr8/image/upload/v1679924952/grepww2o8mwrdebpkbsx.webp",
          is_available: true,
          __v: 0,
        });
        expect(body.item.category.name).toBe("Fruits and veggies");
        expect(body.item.user.username).toBe("John34");
        expect(body.item.user.contact).toBe("07922286099");
      });
  });
  it("401: should not allow users to access endpoint without being authorised", () => {
    return request(app).get("/api/items/56cb91bdc3222f14678934ca").expect(401);
  });
  it("404: should respond with a 404 Not found error message if the passed _id is valid but non-existent", () => {
    return request(app)
      .get("/api/items/56cb91bdc3222f14678934ca")
      .set("Authorization", "Bearer " + token)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Item not found");
      });
  });
});

describe("PATCH /api/items/:_id", () => {
  it("200: should toggle the availability of the item and return the new item", () => {
    return request(app)
      .patch("/api/items/56cb91bdc3464f14678934ca")
      .set("Authorization", "Bearer " + token)
      .send({ username: "Mike20" })
      .expect(200)
      .then(({ body: { item } }) => {
        expect(item.is_available).toBe(false);
      });
  });

  it("200: should not allow a user who hasn't reserved or doesn't own the item to unreserve", () => {
    return request(app)
      .patch("/api/items/56cb91bdc3464f14678934ca")
      .set("Authorization", "Bearer " + token)
      .send({ username: "Janet876" })
      .expect(200)
      .then(({ body: { item } }) => {
        expect(item.is_available).toBe(false);
      });
  });

  it("200: should  allow a user who owns the item to unreserve", () => {
    return request(app)
      .patch("/api/items/56cb91bdc3464f14678934ca")
      .set("Authorization", "Bearer " + token)
      .send({ username: "John34" })
      .expect(200)
      .then(({ body: { item } }) => {
        expect(item.is_available).toBe(true);
      });
  });

  it("401: should only allow an authorised user to toggle availability", () => {
    return request(app)
      .patch("/api/items/56cb91bdc3464f14678934ca")
      .send({ username: "Mike20" })
      .expect(401);
  });

  it("404: should return an error if the item is not found", () => {
    return request(app)
      .patch("/api/items/56cb91bdc4464f14678934ca")
      .set("Authorization", "Bearer " + token)
      .send({ username: "Mike20" })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Item not found");
      });
  });

  it("404: should return an error if the user is not found", () => {
    return request(app)
      .patch("/api/items/56cb91bdc4464f14678934ca")
      .set("Authorization", "Bearer " + token)
      .send({ username: "Mike2" })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("User not found");
      });
  });
});

describe("DELETE /api/items/:_id", () => {
  it('204: should respond with a 204 status "no content" when an item is deleted', () => {
    return request(app)
      .delete("/api/items/56cb91bdc3464f14678934ca")
      .set("Authorization", "Bearer " + token)
      .expect(204);
  });
  it("401: should not allow users to access endpoint without being authorised", () => {
    return request(app)
      .delete("/api/items/56cb91bdc3464f14678934c3")
      .expect(401);
  });
  it("404: should respond with a message if passed an item id that does not exist", () => {
    return request(app)
      .delete("/api/items/56cb91bdc3464f14678934c3")
      .set("Authorization", "Bearer " + token)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Item not found");
      });
  });
  it("404: should respond with path not found if passed a valid but non existant path", () => {
    return request(app)
      .delete("/api/itemz/56cb91bdc3464f14678934ca")
      .set("Authorization", "Bearer " + token)
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
      user: "John34",
      location: {
        type: "Point",
        coordinates: [10, 10],
      },
      expiry_date: new Date("2023-03-28"),
      is_available: "true",
      quantity: 1,
    };
    return request(app)
      .post("/api/items")
      .set("Authorization", "Bearer " + token)
      .send(newItem)
      .expect(201)
      .then(({ body }) => {
        const { item } = body;
        expect(item).toEqual({
          name: "bananas",
          description: "some lovely bananas",
          location: {
            type: "Point",
            coordinates: [10, 10],
          },
          expiry_date: "2023-03-28T00:00:00.000Z",
          is_available: true,
          quantity: 1,
          category: expect.any(String),
          user: expect.any(String),
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
      user: "John34",
      location: {
        type: "Point",
        coordinates: [10, 10],
      },
      expiry_date: new Date("2023-03-28"),
      quantity: 1,
      is_available: "false",
    };
    return request(app)
      .post("/api/items")
      .set("Authorization", "Bearer " + token)
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
      user: "John34",
      expiry_date: new Date("2023-03-28"),
      quantity: 1,
      is_available: "true",
    };
    return request(app)
      .post("/api/items")
      .set("Authorization", "Bearer " + token)
      .send(newItem)
      .expect(201)
      .then(({ body }) => {
        const { item } = body;
        expect(item.location).toEqual({
          type: "Point",
          coordinates: [-1.466667, 52.916668],
        });
      });
  });
  it("201: should ignore superfluous keys", () => {
    const newItem = {
      name: "carrots",
      category: "Fruits and veggies",
      description: "some lovely carrots",
      superfluous: "this key is not required",
      user: "John34",
      expiry_date: new Date("2023-03-28"),
      quantity: 1,
      is_available: "true",
    };
    return request(app)
      .post("/api/items")
      .set("Authorization", "Bearer " + token)
      .send(newItem)
      .expect(201)
      .then(({ body }) => {
        const { item } = body;
        expect(item).not.toHaveProperty("superfluous");
      });
  });
  it("401: should not allow users to access endpoint without being authorised", () => {
    const newItem = {
      name: "bananas",
      category: "Fruits and veggies",
      description: "some lovely bananas",
      user: "John34",
      location: { type: "Point", coordinates: [10, 10] },
      expiry_date: new Date("2023-03-28"),
      is_available: "true",
      quantity: 1,
    };
    return request(app).post("/api/items").send(newItem).expect(401);
  });
  it("404: should respond with a 404 if username does not exist ", () => {
    const newItem = {
      name: "bananas",
      category: "Fruits and veggies",
      description: "some lovely bananas",
      user: "John",
      location: { type: "Point", coordinates: [10, 10] },
      expiry_date: new Date("2023-03-28"),
      quantity: 1,
      is_available: "true",
    };
    return request(app)
      .post("/api/items")
      .set("Authorization", "Bearer " + token)
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
      user: "John34",
      location: { type: "Point", coordinates: [10, 10] },
      expiry_date: new Date("2023-03-28"),
      quantity: 1,
      is_available: "true",
    };
    return request(app)
      .post("/api/items")
      .set("Authorization", "Bearer " + token)
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
      user: "John34",
      location: { type: "Point", coordinates: [10, 10] },
      expiry_date: new Date("2023-03-28"),
      quantity: 1,
      is_available: "true",
    };
    return request(app)
      .post("/api/items")
      .set("Authorization", "Bearer " + token)
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
      user: "John34",
      location: { type: "Point", coordinates: [10, 10] },
      quantity: 1,
      is_available: "true",
    };
    return request(app)
      .post("/api/items")
      .set("Authorization", "Bearer " + token)
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
      user: "John34",
      location: { type: "Point", coordinates: [10, 10] },
      expiry_date: new Date("2023-03-28"),
      is_available: "true",
    };
    return request(app)
      .post("/api/items")
      .set("Authorization", "Bearer " + token)
      .send(newItem)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request - quantity is required");
      });
  });
});

describe("GET /api/categories", () => {
  it("200: should return a list of categories ", () => {
    return request(app)
      .get("/api/categories")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories).toHaveLength(8);
        categories.forEach((category) => {
          expect(category).toHaveProperty("_id", expect.any(String));
          expect(category).toHaveProperty("name", expect.any(String));
          expect(category).toHaveProperty("imageUrl", expect.any(String));
          expect(category).toHaveProperty("__v", expect.any(Number));
        });
      });
  });
  it("401: should not allow users to access endpoint without being authorised", () => {
    return request(app).get("/api/categories").expect(401);
  });
});
