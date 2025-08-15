const User = require("../models/user.js");
const { validateEditProfileData } = require("../utils/validation.js");

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
 
    
    if(!validateEditProfileData(req)){
      return res.status(400).send("Invalid Edit Request");
    }

      const loggedInUser = req.user;
 

      // Handle photo upload if file is present
      if (req.file) {
      
        loggedInUser.photoUrl = req.file.path;
      }

      // Update other fields
      Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
      
      await loggedInUser.save();
      

      return res.json({
         message: `${loggedInUser.name},your profile has been updated Successfully`,
         data: loggedInUser,
      })
    
  } catch(err) {
    console.error("Error in userProfileEdit:", err);
    res.status(400).send("An error occurred: " + err.message);
  }
};

const userProfilePassword = async(req,res) => {
// will think on this !!!!
}

module.exports = { userProfile, userProfileEdit,userProfilePassword };
