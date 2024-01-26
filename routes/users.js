var express = require("express");
const {
  getAll,
  create,
  getUserByName,
  updateUserByName,
} = require("../controllers/user-controller");
var router = express.Router();

/* GET users listing. */
router.get("/", getAll);
router.post("/", create);
router.get("/:name", getUserByName);
router.put("/:name", updateUserByName);

module.exports = router;
