const mongoose = require('mongoose'); 
const { ObjectId } = mongoose.Schema.Types
const User = mongoose.Schema({

      name: {
          type:String,
          required: true,
          maxLength: 50

      }, 
      resetToken: {
        type: String, 
        required: false
      },
      expireToken:{
        type: String, 
        required: false
      },
      email: {
        type:String,
        required: true,
        unique: 1
      }, 
      password: {
        type:String,
        required: true,
        minLength: 6,
      }, 
      photo: {
      type:String, 
      required: true
      },
      followers:[{type:ObjectId, ref: "User" }],
      following:[{type:ObjectId, ref: "User" }],
})


module.exports = mongoose.model("User",User)