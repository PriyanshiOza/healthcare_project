const JWT = require('jsonwebtoken');

module.exports = async(req,res,next) => {
    try{
        const token = req.headers["authorization"].split(" ")[1];
        JWT.verify(token,"jwt-secret-key" , (err,decode)=>{
            if(err){
                return res.status(401).send({
                    sucess:false,
                    message:'Authentication Failed'
                });
            }
            else{
                req.body.userId = decode.userId;
                next();
            }

        });

    }
    catch(error)
    {
        console.log(error);
        return res.status(401).send({
            sucess:false,
            error,
            message:'Authentication Failed'
        })
    }

}