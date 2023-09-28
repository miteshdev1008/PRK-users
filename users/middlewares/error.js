class customError extends Error{
    constructor(message,statuscode){
        console.log("first")
            super(message);
            this.statuscode=statuscode;
            this.status=statuscode >=400 && statuscode<=400 ? 'fail':'error';
            this.isoperational=true;
            Error.captureStackTrace(this,this.constructor) 
        }
}
module.exports=customError;