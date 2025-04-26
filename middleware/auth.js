 const adminAuth = (req,res,next)=>{
  const token = "xyz";
  const authorized = "xyz";
  if(token != authorized){
    res.status(401).send("BEtichod ke ");
  }
  else{
   next();
  }
}


const userauth = (req,res,next) => {
    const token = "hello"
    const authMiddle = "hello"
    if(token != authMiddle){
        res.send("galat error hai");
    }
    else{
        next();
    }
}
module.exports = {adminAuth,userauth};