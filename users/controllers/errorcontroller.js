module.exports=(err,req,res,next)=>{
    err.statuscode=err.statuscode||500;
    err.message=err.message||'somethingwentwrong';
    res.status(err.statuscode).json({
        success:false,
        msg:err.message,          
})}