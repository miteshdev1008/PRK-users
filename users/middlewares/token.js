const jwt=require('jsonwebtoken');
// const nodemailer=require('nodemailer');
require('dotenv').config({ path: '/home/siddharth/prk/.env' });
const seckey=process.env.JWTSECKEY;
// console.log(seckey);
const usermodel=require('../models/usermodel');

const createtoken=async(id)=>{
    const gentokentoken=await jwt.sign({id:id},seckey);
    const update=await usermodel.findByIdAndUpdate(id,{token:gentokentoken},{new:true});
     console.log(gentokentoken);
    return gentokentoken;
}
module.exports={createtoken}