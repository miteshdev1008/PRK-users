require('dotenv').config({ path: '/home/siddharth/prk/.env' });
// console.log("otp expiration time is"+process.env.OTP_EXPIRATION);
const otpexpires=(generatedTime)=>{
    const currentTime = new Date();
    // console.log("generated time is"+generatedTime);
    // console.log("current time is"+currentTime);
    const timeDiff = currentTime - generatedTime;//Jun 10 2023 17:42:09 GMT+0530 (India Standard Time)
    //Sat Jun 10 2023 17:44:50 GMT+0530 (India Standard Time)
    // console.log(timeDiff);
    const timeDiffMinutes = Math.floor(timeDiff / 1000 / 60); // Convert milliseconds to minutes
    // console.log(timeDiffMinutes);
    const otpexptime=process.env.OTP_EXPIRATION||2;
    if (timeDiffMinutes >= 0 && timeDiffMinutes <= otpexptime) {
        // OTP generated within 2 minutes
        const otpExpiration = otpexptime * 60 * 1000; // Convert minutes to milliseconds
        // console.log("is"+otpExpiration);
        const otpExpiresAt = generatedTime.getTime() + otpExpiration;
        // console.log(otpExpiresAt);
        if (currentTime.getTime() <= otpExpiresAt) {
          // OTP has not expired
          return true;
        }
      }
      return false;

    }
const sendsms=(no,msg)=>{

}
const gettimeformat=()=>{
  var currentDate = new Date();

var monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var month = monthNames[currentDate.getMonth()];
var date = currentDate.getDate();
var year = currentDate.getFullYear();

var hours = currentDate.getHours();
var minutes = currentDate.getMinutes();


console.log("Current date and time:");
console.log("Month: " + month);
console.log("Date: " + date);
console.log("Year: " + year);
console.log("Time: " + hours + ":" + minutes + ":" + seconds);
console.log(`${month} ${date},${year} ${hour} ${minute}`);
return `${month} ${date},${year} ${hour} ${minute}`
}
module.exports={otpexpires,sendsms,gettimeformat}