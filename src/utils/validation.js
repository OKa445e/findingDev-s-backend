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

  // Check if all body fields are allowed
  const bodyFieldsValid = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  // If there's a file upload, it's also valid (file uploads don't add to req.body)
  const hasValidFile = req.file && req.file.mimetype && req.file.mimetype.startsWith('image/');

  return bodyFieldsValid && (req.body.name || hasValidFile);
};

module.exports = {
  validateSignupData,
  validateEditProfileData,

};
