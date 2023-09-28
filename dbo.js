const mon=require('mongoose');
require('dotenv').config({ path: '/home/siddharth/prk/.env' });
// console.log(process.env.MONGO_URI);
mon.connect(process.env.MONGO_URI)
.then(()=>console.log("app is connected with db successfully"))
.catch((e)=>console.log(e));
