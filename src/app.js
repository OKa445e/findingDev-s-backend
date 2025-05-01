const express = require("express");

const connectDB = require("./config/database.js");
const User = require("./models/user.js");

const app = express();

app.use(express.json());



app.post("/signup",async (req,res)=> {
  const user = await User(req.body);

  try {
    await user.save();
    res.send("User created successfully");
  } catch(err){
    res.send(400).send("An error occured" + err.message);
  }
});

// singleuser
app.get("/user",async (req,res)=>{
 const userEmail = req.body.emailId;
 
 try {
  const users = await User.findOne({emailId:userEmail});

  if(!users){
    res.status(400).send("User didnt exist")
  }
  else{
    res.send(users);
  }
  
 }catch(err){
  res.send(400).send("An error occured" + err.message);
}
});

app.get("/feed",async(req,res) => {
  
  try{
    const users = await User.find({});

  if(users.length == 0) {
    res.status(400).send("users are not found");
  }
  else{
    res.send(users);
  }
  }catch(err){
    res.status(400).send("An error occurred"+ err.message);
  }
  
});


app.get("/getbyid/:id",async(req,res) => {
  const userId = req.params.id;
  try {
    const users = await User.findById(userId);

    if(!users) {
      res.status(400).send("Something went wrong !");
      console.log(users);
      
    }
    else{
      res.send(users);
    }
  }catch(err){
    res.status(400).send("An error occurred")
    console.log(err.message);    
  }
});

app.delete("/deletebyid/:id",async(req,res)=>{
  const userId = req.params.id;
 
  try{
    const userDelte = await User.findByIdAndDelete(userId);
  
  if(!userDelte){
    res.status(400).send("User not found");
  }
  else{
    res.send("User deleted successfully");
  }
  } catch(err){
    res.status(400).send("An error occurred");
    console.log(err.message);   
  }  
});

app.patch("/updatebyid/:id",async (req,res) => {
  const userId = req.params.id;
  const data = req.body;

  try{
   const userUpdate = await User.findByIdAndUpdate(userId,data);

   res.send("User updated successfully");
  } catch(err){
    res.status(200).send("Something went wrong");
     console.log(err.message);    
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
