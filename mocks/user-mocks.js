const userModel = require("../model/user-model");

const usersMock = [
  { name: "John Doe", age: 30 },
  { name: "Jane Doe", age: 25 },
  { name: "John Smith", age: 40 },
];

loadInitialUsersOnMongoDB = async () => {
  await userModel.deleteMany({});
  await userModel.insertMany(usersMock);
};

module.exports = { loadInitialUsersOnMongoDB, usersMock };
