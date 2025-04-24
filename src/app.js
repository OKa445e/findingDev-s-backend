const express = require("express");

const app = express();


app.get("/",(req,res) => {
  res.send("Hey there");
})
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`successfully listening on server ${PORT}`);
});

