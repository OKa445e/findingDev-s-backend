const express = require("express");

const connectDB = require("./config/database.js");
const User = require("./models/user.js");

const app = express();

app.post("/signup",async (req,res)=> {
  
  const user = new User({
    name: "Atharv sinha",
    age: 22,
    emailId: "atharv@gmail.com",
    password: "atharv",
    gender: "Male"
  });
  try {
    await user.save();
    res.send("User added successfuly")
  }catch(err){
    res.status(400).send("An error occured while saving" + err.message);
  }
})




const PORT = 4000;

connectDB()
  .then(() => {
    console.log("Database connected Successfully");
    app.listen(PORT, () => {
      console.log(`successfully listening on server ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("There is error while connecting to database", err);
  });
