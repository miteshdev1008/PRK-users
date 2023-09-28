const mongoose = require('mongoose');
require('dotenv').config();
require('../../dbo');

const userschema = new mongoose.Schema({
    name: {type: String,required:[true,'Name is required'],trim:true},
    mobile: {type: Number,required:[true,'mobile is required'],unique:true,trim:true,minlength:[10,'please enter 10 difgit mobile no']},
    password: {type: String},
    city: {type: String },
    mpin: {type: Number},
    balanceofuser:{type:Number,default:15000},
    token:{type:String}
}, { timestamps: true });

module.exports = mongoose.model('usersofatm', userschema);