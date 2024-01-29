const { describe, expect, it } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { loadInitialUsersOnMongoDB, usersMock } = require("../mocks/user-mocks");
const { default: mongoose } = require("mongoose");
const userModel = require("../model/user-model");

describe("Users test", () => {
  const mongoServer = new MongoMemoryServer();
  const newUser = { name: "New User", age: 50 };
  const testToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzA2NTUzNTQ3fQ.po0yMA-M9_q5DAOsinoQG4cJSSjY2ofSAI1slNjrYIM";
  const agent = request.agent(app);

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await mongoServer.start();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await loadInitialUsersOnMongoDB();
  });

  it("has to return a http only cookie if user exists", async () => {
    const userToTest = usersMock[0];
    const { statusCode, header } = await request(app)
      .post("/users/login")
      .send({ username: userToTest.name });
    expect(statusCode).toBe(201);
    console.log(header["set-cookie"][0]);
    expect(header["set-cookie"][0]).toMatch(/token=.+; HttpOnly/);
  });

  it("when token cookie is sent in the request, has to return the user", async () => {
    const userToTest = usersMock[0];
    const { statusCode, body } = await agent
      .get("/users/profile")
      .set("Cookie", [`token=${testToken}`]);
    expect(statusCode).toBe(200);
    expect(body.name).toBe(userToTest.name);
  });

  it("has to return status 200 when call index endpoint", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
  });

  it("has to return a list of users", async () => {
    const response = await request(app).get("/users");
    expect(response.body.length).toBe(usersMock.length);
  });

  it("has to add a new user when call create endpoint", async () => {
    const { statusCode } = await request(app).post("/users").send(newUser);
    expect(statusCode).toBe(201);
    const usersFound = await userModel.find({});
    expect(usersFound.length).toBe(usersMock.length + 1);
  });

  it("user is not sent in the body, has to return status 400", async () => {
    const { statusCode } = await request(app).post("/users").send({});
    expect(statusCode).toBe(400);
  });

  it("when create a new user only name is mandotory", async () => {
    delete newUser.age;
    const { statusCode } = await request(app).post("/users").send(newUser);
    expect(statusCode).toBe(201);
  });

  it("when create a new user only age it throws an error because name is mandotory", async () => {
    delete newUser.name;
    const { statusCode, body } = await request(app)
      .post("/users")
      .send(newUser);
    expect(statusCode).toBe(400);
    expect(body.message).toBe("name is a required field");
  });

  it("when find a user by name the user is returned", async () => {
    const userToTest = usersMock[0];
    const { statusCode, body } = await request(app).get(
      `/users/${userToTest.name}`
    );
    expect(statusCode).toBe(200);
    expect(body.name).toBe(userToTest.name);
  });

  it("if the user is not found by name, has to return status 404", async () => {
    const { statusCode } = await request(app).get(`/users/Not Found`);
    expect(statusCode).toBe(404);
  });

  it("when update age of a user, the age is changed", async () => {
    const userToTest = usersMock[0];
    const { statusCode } = await request(app)
      .put(`/users/${userToTest.name}`)
      .send({ age: userToTest.age + 1 });
    expect(statusCode).toBe(200);

    const userFromDatabase = await userModel.findOne({ name: userToTest.name });
    expect(userFromDatabase.age).toBe(userToTest.age + 1);
  });

  it("when update if user does not exist, has to return status 404", async () => {
    const { statusCode } = await request(app)
      .put(`/users/NotFound`)
      .send({ age: 1 });
    expect(statusCode).toBe(404);
  });
});
