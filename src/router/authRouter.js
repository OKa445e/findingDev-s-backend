const express = require("express");
const {
  signupAuth,
  loginAuth,
  logoutAuth,
} = require("../controller/authController");
const { userauth } = require("../middleware/auth");
const passport = require("../middleware/googleAuth");
const upload = require("../middleware/upload");

const authRouter = express.Router();

authRouter.post("/signup", signupAuth);

authRouter.post("/login", loginAuth);

authRouter.post("/logout", logoutAuth);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  async (req, res) => {
    try {
      const token = await req.user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 3600000),
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax'
      });
      res.redirect("http://localhost:5173/profile");
    } catch (error) {
      console.error("Error in Google callback:", error);
      res.redirect("http://localhost:5173/login");
    }
  }
);

module.exports = authRouter;
