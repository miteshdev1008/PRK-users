const mon=require('mongoose');
require('../../dbo');

const transactionschema=new mon.Schema({
    from:{type:String},
    to:{type:String},
    type:{type:String},
    amount:{type:Number},
},{timestamps:true});

module.exports=mon.model('transactionschema',transactionschema);    