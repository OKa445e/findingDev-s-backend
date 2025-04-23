const express = require("express");

const app = express();


app.use("/test",(req,res) => {
  res.send('Request is running on server');
})
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`successfully listening on server ${PORT}`);
});
