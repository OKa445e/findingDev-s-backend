const User = require("../models/user.js");
const validateEditProfileData = require("../utils/validation.js");

const userProfile = async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("An error occurred: " + err.message);
  }
};

const userProfileEdit = async (req, res) => {
  try {
    if(!validateEditProfileData){
      return res.status(400).send("Invalid Edit Request");
      
    }

      const loggedInUser = req.user;

      Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
      
      await loggedInUser.save();

      return res.json({
         send: `${loggedInUser.name},your profile has been updated Successfully`,
         data: loggedInUser,
      })
    
  } catch(err) {
    res.status(400).send("An error occurred: " + err.message);
  }
};

const userProfilePassword = async(req,res) => {
// will think on this !!!!
}

module.exports = { userProfile, userProfileEdit,userProfilePassword };
