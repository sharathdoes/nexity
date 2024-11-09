const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
          username:{
                    type:String,
                    required:true
          },
          email:{
                    type:String,
                    required:true
          },
          password:{
                    type:String,
                    required:true
          },
          Followers:{
                    type:Array,
          },
          Following:{
                    type:Array,
          },
          phonenumber:{
                    type:Number,
                    required:true
          },
          profile:{
                    type:String,
          },
          verifed:{
                    type:Boolean,
                    required:true,
                    default:false
          },
          role: { type: String},
          leetcodeInfo: [Object],
          githubInfo: [Object],
          linkedinInfo: [Object],
})

module.exports = mongoose.model("userdds" , UserSchema);