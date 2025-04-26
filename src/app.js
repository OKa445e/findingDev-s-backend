const express = require("express");

const app = express();
const {adminAuth} = require("../middleware/auth.js");

const {userauth} = require("../middleware/auth.js");

app.use("/admin",adminAuth);

app.get("/",(req,res,next) => {
  // res.send("Hey there");
  next();
},(req,res)=> {
  res.send("baape di meher jatt dont care")
});

app.get("/user/register",userauth,(req,res)=>{
  res.send("sahi hain bete");
})

app.post("/user/login",(req,res)=> {
  res.send("sahi hai bete hai karle login")
})
app.post("/admin/baap",(req,res)=>{
  res.send("kya launde ki haal hai ");

})
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`successfully listening on server ${PORT}`);
});

