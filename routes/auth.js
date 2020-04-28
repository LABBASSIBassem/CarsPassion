const express = require('express'); 
const router = express.Router(); 
const crypto = require('crypto')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const { JWT_SECRET,API_KEY,SEND_EMAIL,EMAIL } = require('../config/keys');
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendGridTransport({
    sendmail: true,
    auth:{
        api_key: API_KEY
    }
}))


//creating the signIn API
router.post('/api/signin', (req, res) =>{
   const { email , password } = req.body; 
   if(!email || !password){
      return res.status(422).json({error: "please provide email or password"})
   }
    User.findOne({email: email}).then(savedUser=>{
       if(!savedUser){
           return  res.status(422).json({error: "invalid user data  please try again"})
             }
       bcrypt.compare(password, savedUser.password)
        .then(doMatch =>{
            if(doMatch){
            const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
            const {_id, name, email, followers, following, photo } = savedUser
            res.json({message: "welcome",token, user:{_id, name, email, followers, following, photo}})
            }
        else{
           return res.status(400).json({error:"invalid password please try again"})
        }
        })

    })
    .catch(err=> res.send(err))
})

//creating the signUp API
router.post('/api/signup', (req, res) =>{
    const { name, email , password, pic } = req.body; 
    if(!name || !email || !password || !pic){
      return res.status(400).json({error: "please verify your data"})
    }
    else{
        User.findOne({email:email}).then((savedUser)=>{
            if(savedUser){
             return res.status(422).json({error: "User already exist"})
            }
            bcrypt.hash(password,12)
            .then(hasedPassword =>{
                const user = new User({name: name,email: email,password: hasedPassword,photo:pic});
                user.save().then((user)=>{
                    transporter.sendMail({
                        to: user.email,
                        from: SEND_EMAIL,
                        subject: 'signup success', 
                        html: '<h1>welcomme to cars passion</h1>'
                    })
                    res.json({message: "you're account was successfully created"})
                
                })
                .catch((err)=>{res.json({message: "geting error while creating the useree"})})
            }).catch(err=> res.json({error:'getting error while creating the user'}))
        })
    }

})


router.post('/api/forgetpassword',(req,res)=>{
    const {email} = req.body
 crypto.randomBytes(32,(err,buffer)=>{
    if(err){
        console.log(err)
    }
    const token = buffer.toString('hex')
    User.findOne({email: email})
    .then((user)=>{
        if(!user){
            return res.status(422).json({error: "User dont exists with that email"})
        }
        user.resetToken = token
        user.expireToken = Date.now() + 3600000
        user.save().then(result =>{
            transporter.sendMail({
                to: user.email,
                from: SEND_EMAIL,
                subject: 'reset password', 
                html: `
                <p>You requested for password reset </p>
                <h5>Click on the link below to reset you'r password</h5>
                <a href="${EMAIL}/reset/${token}">link</a>
                `
            })
            res.json({message: "check you'r email"})
        })
    })

 })

})

router.post('/api/newpassword',(req,res)=>{
    const {password, token} = req.body
    if(!password || !token)
    {return res.status(422).json({error: "please provide a vaild email"})
    }

    User.findOne({resetToken: token, expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error: "Try again session expired"}) 
        }
        bcrypt.hash(password,12).then(
            hasedPassword =>{
                user.password = hasedPassword; 
                user.resetToken= undefined
                user.expireToken = undefined
                user.save().then((err, user)=>{
                    res.status(200).json({message: "password successfully updated"})
                }).catch(err=>{
                    console.log(err)
                })
            }
        )

    })
})




module.exports = router

