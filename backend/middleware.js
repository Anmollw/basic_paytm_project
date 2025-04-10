const { JWT_SECRET } = require("./jwtconfig");


const authmiddleware= (req,res,next)=>{
    const authheader = req.headers.authorization;
    if(!authheader || !authheader.startsWith('Bearer ')){
        return res.status(403).json({})
    }

    const token = authheader.split(' ')[1];

    try {
        const decoded = jwt.verify(token,JWT_SECRET);
        console.log(decoded);
        if(decoded.userId){
            req.userId = decoded.userId;
            next();
        }
        else{
            return res.status(403).json({});
        }
    } 
    
    catch (err) {
        return res.status(403).json({})
    }

}

module.exports = {
    authmiddleware
}


