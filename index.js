require("dotenv").config()
const express = require("express")
const jwt = require('jsonwebtoken')

const app = express()
const port = 3000

// Express middleware
app.use(express.json())


// post object
const posts = [
    {
        name:"Mohammad",
        home:"Dhaka"
    },
    {
        name:"Sakib",
        home:"Rangpur"
    },
    {
        name:"Rahim",
        home:"Dhaka"
    }
]
// Basic Local Route
app.get("/",(req,res)=>{
    res.send("Hello Web Developer!")
})
app.get("/posts",authenticateToken,(req,res)=>{
    res.json(posts.filter(post => post.name === req.user.name))
})
// LOGIN Route
app.post("/login",(req,res)=>{
    // user Authentication
    const username = req.body.username
    const user = {
        name:username
    }
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken:accessToken})
})

// Authentication Bareear with jwt
function authenticateToken(req,res,next){
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if(token == null) return res.sendStatus(401)
    console.log(token)
    // verify jwt token
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

// Server Running based on port 
app.listen(port,()=>console.log(`Server Running at ${port} port.` ))