const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 20,
      trim: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
      minlength: [8, "Password must be at least 8 characters long"],
      validate(value) {
        if (this.provider === "local" && !validator.isStrongPassword(value)) {
          throw new Error(
            "Password must be strong (include uppercase, lowercase, number, and symbol)"
          );
        }
      },
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "Gender must be male, female, or others",
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpwxCN33LtdMLbWdhafc4HxabqpaU0qVbDxQ&s",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo URL is not valid");
        }
      },
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      match: [
        /^[a-zA-Z0-9\s.,'"\-!?()]*$/,
        "Special characters not allowed in about section",
      ],
      maxlength: [200, "About section must be less than 200 characters"],
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    providerId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id },
    "f3b6a0e2a8f8caa2d11a6b8b14d1f9cc48e207fd5e9f9991c87e8f63cba221e5d901",
    { expiresIn: "7d" }
  );

  return token;
};

userSchema.methods.validatePassword = async function (passwordByUser) {
  const user = this;

  const hashedPassword = user.password;

  const isPasswordValid = await bcrypt.compare(passwordByUser, hashedPassword);

  return isPasswordValid;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
