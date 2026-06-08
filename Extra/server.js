const express=require("express");
const app=express();
var session = require('express-session')


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

app.get("/reqcount",(req,res)=>{
    if (req.session.count) {
        req.session.count++;
    }
    else{
        req.session.count=1;
    }
    
    res.send(`you sent request ${req.session.count} times`);
})


app.listen(3000,()=>{
    console.log("app is working on 3000 port");
})