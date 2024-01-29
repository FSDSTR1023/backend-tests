const jwt = require("jsonwebtoken");

const singWithJwt = (payload, callback) => {
  return jwt.sign(payload, "gallina-loca", callback);
};

module.exports = { singWithJwt };
