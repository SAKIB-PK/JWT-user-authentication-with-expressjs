require("dotenv").config()
const express = require("express")
const jwt = require('jsonwebtoken')
const app = express()
const port = 5000

// Express middleware
app.use(express.json())


// store localhost to refreshToken
let refreshTokens = []
// token route 
app.post("/token",(req,res)=>{
    const token = req.body.token
    if(token == null) return res.sendStatus(401)
    if(!refreshTokens.includes(token)) return res.sendStatus(403)
    jwt.verify(token,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403)
        const accessToken = generateToken({name:user.name})
        res.json({accessToken:accessToken})
    })

})
// logout Route
app.delete("/logout",(req,res)=>{
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})
// LOGIN Route
app.post("/login",(req,res)=>{
    // user Authentication
    const username = req.body.username
    const user = {
        name:username
    }
    const accessToken = generateToken(user)
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({accessToken:accessToken,refreshToken:refreshToken})
})

// Authentication Bareear with jwt
function generateToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15s"})
}
app.listen(port,()=>console.log(`Server Running at ${port} port.` ))