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

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "name",
    "photoUrl",
    "skills",
    "age",
    "about",
    "gender",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = {
  validateSignupData,
  validateEditProfileData,

};
