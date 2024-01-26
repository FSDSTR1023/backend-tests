const { object, string, number } = require("yup");

const userSchema = object({
  name: string().required(),
  age: number(),
});

// parse and assert validity
const userObjectValidator = (user) => userSchema.validateSync(user);

module.exports = userObjectValidator;
