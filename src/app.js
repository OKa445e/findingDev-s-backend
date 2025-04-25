const express = require("express");

const app = express();


app.get("/",(req,res,next) => {
  // res.send("Hey there");
  next();
},(req,res)=> {
  res.send("baape di meher jatt dont care")
})
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`successfully listening on server ${PORT}`);
});

