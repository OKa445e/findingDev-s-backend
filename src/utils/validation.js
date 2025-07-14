const validator = require("validator");

const validateSignupData = async (req) => {
  const { name, emailId, password } = req.body;
  if (!name) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("EmailId is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not valid");
  }
};

module.exports = {
    validateSignupData
}