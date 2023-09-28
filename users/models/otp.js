const mon=require('mongoose');
require('../../dbo');


const otpschema=new mon.Schema({
    //name:{type:String},
    no:{type:Number},
    otp:{type:Number},
    
},{timestamps:true});

module.exports=mon.model('otpsch',otpschema);