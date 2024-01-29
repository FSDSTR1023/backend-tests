var express = require("express");
const {
  getAll,
  create,
  getUserByName,
  updateUserByName,
  login,
  getAuthorizedUser,
} = require("../controllers/user-controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
var router = express.Router();

/* GET users listing. */
router.post("/login", login);
router.get("/", getAll);
router.post("/", create);
router.get("/profile", authMiddleware, getAuthorizedUser);
router.get("/:name", authMiddleware, getUserByName);
router.put("/:name", updateUserByName);

module.exports = router;
