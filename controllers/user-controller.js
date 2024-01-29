const UserService = require("../service/user-service");
const userObjectValidator = require("./user-validator");
const { singWithJwt } = require("../helpers/jwt-helpers");

const UserController = {
  login: async (req, res) => {
    const { username } = req.body;

    const user = await UserService.getUserByName(username);

    if (!user) {
      res.status(401).send({ error: "User not found" });
      return;
    }
    singWithJwt({ username }, (err, token) => {
      if (err) {
        res.status(401).send({ error: err.message });
      } else {
        res
          .cookie("token", token, {
            httpOnly: true,
            secure: false,
            expires: new Date("2100-12-17T03:24:00"),
          })
          .status(201)
          .send();
        //res.status(201).send({ token });
      }
    });
  },
  getAuthorizedUser: async (req, res) => {
    const user = await UserService.getUserByName(req.user.username);
    res.json(user);
  },

  getAll: async (req, res) => {
    return res.send(await UserService.getAll());
  },
  create: async (req, res) => {
    try {
      const validateResult = userObjectValidator(req.body);
      const user = await UserService.create(validateResult);
      return res.status(201).send(user);
    } catch (err) {
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
