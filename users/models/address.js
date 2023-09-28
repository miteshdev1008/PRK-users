const mon=require('mongoose');
require('../../dbo');


const addressschema=new mon.Schema({
    //name:{type:String},
    lat:{type:String},
    long:{type:String},
    type:{type:String},
    address:{type:String},
    title:{type:String},
    uploadedby:{type:String}
},{timestamps:true});

module.exports=mon.model('addressschema',addressschema);