const jwt = require('jsonwebtoken');

const isAuthenticated = async(req,res,next) => {
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token,'TOP_SECRET',(err,decodedToken)=>{
            if(err){
                return res.sendStatus(403);
            }
            req.user = decodedToken.user;
            next();
        })
    }else{
        res.sendStatus(401);
    }
    
}

module.exports = {isAuthenticated};