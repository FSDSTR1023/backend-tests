const userModel = require("../model/user-model");

const UserService = {
  getAll: () => {
    return userModel.find({});
  },
  create: (user) => {
    return userModel.create(user);
  },
  getUserByName: (name) => {
    return userModel.findOne({ name });
  },
  updateUserByName: (name, user) => {
    return userModel.findOneAndUpdate({ name }, user);
  },
};

module.exports = UserService;
