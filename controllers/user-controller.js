const { use } = require("../app");
const UserService = require("../service/user-service");
const userObjectValidator = require("./user-validator");

const UserController = {
  getAll: async (req, res) => {
    return res.send(await UserService.getAll());
  },
  create: async (req, res) => {
    try {
      const validateResult = userObjectValidator(req.body);
      const user = await UserService.create(validateResult);
      return res.status(201).send(user);
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: err.message });
    }
  },
  getUserByName: async (req, res) => {
    const { name } = req.params;
    const user = await UserService.getUserByName(name);
    if (!user) return res.status(404).send({ message: "User not found" });
    return res.send(user);
  },
  updateUserByName: async (req, res) => {
    const { name } = req.params;
    const user = await UserService.updateUserByName(name, req.body);
    if (!user) return res.status(404).send({ message: "User not found" });
    return res.send(user);
  },
};

module.exports = UserController;
