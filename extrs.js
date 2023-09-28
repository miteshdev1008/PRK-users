require('./dbo')
const { Receive } = require('twilio/lib/twiml/FaxResponse');
const transactionmodel = require('./users/models/transactions')
//   const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
//   var formattedDate = date.toISOString().slice(0, 10);
//   dates.push(formattedDate);
// }
// console.log(dates);
// const getdata=async()=>{
//   today.setHours(0, 0, 0, 0);
//   // Calculate the start and end dates for today
//   var startDate = today;
//   var endDate = new Date(today.getTime() + (24 * 60 * 60 * 1000)-1);

// Create the MongoDB query to retrieve today's data
// var query = {
//   createdAt: {
//     $gte: formattedDate[i],
//     $lt: formattedDate[i]-1
//   }

// {$and:[{from:"1234567890"},
// {createdAt:{
//   $gte: startDate,
//   $lt: endDate}
// }]});
// // };
//today.setHours(0, 0, 0, 0);
// Calculate the start and end dates for today
const getdata = async () => {
  
  setTimeout(async () => {
  // console.log(today);
    // for (var i = 0; i <= 7; i++) {
      // if (i == 0) continue;
//       const currentDate = new Date()
//       const startdate = new Date(currentDate).setDate(new Date().getDate() - 3);
//       const enddate = new Date(currentDate).setDate(new Date().getDate()-2);
// //       const startdate = new Date('2023-06-22'); /1/ Start date
// const enddate = new Date('2023-06-23');   // End date
// const currentDate = new Date(); // Get the current date

// const startdate = new Date(currentDate); // Create a new date object with the current date
// startdate.setDate(currentDate.getDate()-3); // Subtract 1 day from the current date

// const enddate = new Date(currentDate); // Create a new date object with the current date
// enddate.setDate(currentDate.getDate()-2); // Subtract 1 day from the current date

let startdate= new Date();
startdate.setDate(startdate.getDate()-2);
let enddate= new Date();
enddate.setDate(enddate.getDate()-1);
console.log(startdate)
console.log(enddate);
// const a=enddatea+'';
// console.log("a is "+a.slice(0,9));
// console.log(enddatea);
// const startdate=new Date('2023-06-22');
// const enddate=new Date('2023-06-23');

// console.log( "start date is"+new Date(startdate).getDate()+" "+ new Date(enddate).getDate());
const senddata = await transactionmodel.find({ $and:
   [
    { from: '648c10f16ebdc8930c31eca7' },
        { createdAt: { $gte: startdate.toISOString(), 
      $lt: enddate.toISOString()}
 }
    ] 
  });
  const receivedata = await transactionmodel.find({ $and:
    [
     { to: '648c10f16ebdc8930c31eca7' },
         { createdAt: { $gte: startdate.toISOString(), 
       $lt: enddate.toISOString()}
  }
     ] 
   });


//  if(receivedata) console.log(receivedata._id); 
console.log(senddata);
      console.log(receivedata);
      var send = senddata.reduce((sum, ele) => { return sum + ele.amount }, 0);
      var receive = receivedata.reduce((sum, ele) => { return sum + ele.amount }, 0);

      console.log(new Date(startdate).toString().split(' ')[2] +" "+new Date(enddate).toString().split(' ')[2]+" send is" + send +"receive is"+receive);
    // }

  }, 2000);
}
getdata();



















// // const edate=new Date(enddate);
// console.log(sdate+edate);
// console.log(final);
// var todayDate = new Date();

// for(i=0;i<7;i++){
// // console.log(todayDate.getDate().toString());
// const newdate=todayDate.getDate() - 1;
// todayDate.setDate(newdate);

// // console.log(todayDate.getDate() - 1)
// console.log(todayDate.toString().split(' ')[0]);
// }

// var createdAt = "2023-06-21T10:20:18.153+00:00"
// var date = new Date(createdAt)
// console.log(date.getDate() +  " " + date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear()+date.getHours())


// // Or even more concise (Thanks @RobG)
// console.log(date.toLocaleString('en-GB', {day:'numeric', month: 'long', year:'numeric'}))