const passcheck=(pass)=>{
   const a= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/
    if(!a.test(pass)){
            return "please enter password in valid fromat"
    }
    else{
       return true;
    }
}
const stringonly=(str)=> {
        
        if(!/[^a-zA-Z]/.test(str)){
                return true;
      }
      else 
      {console.log("first")
      return "please enter alphabats only in string";
        
      }
}
module.exports={passcheck,stringonly}