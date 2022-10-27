const repo = require('../Repository/UserRepository');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'this is my secret key for JSONWEBTOKEN';
const RegisterUser=(req,res)=>{
    repo.RegisterUser(req.body)
    .then((data)=>{
        res.send(data);
    }).catch((err)=>{
        res.status(404).send(err);
    });
}
const GetUser=(req,res)=>{
    repo.GetUser()
    .then((data)=>{
        res.send(data);
    }).catch((err)=>{
        res.status(404).send(err);
    });

}
const LoginUser=(req,res)=>{
    res.send({
        status:200,
        token:jwt.sign(req.session.passport,SECRET_KEY,{expiresIn:'1h'})
    });
}
const VerifyToken = (req, res) =>{
    let result = jwt.verify(req.headers.authorization, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err);
    if (result instanceof Error) {
        res.send({ status: 401, isAuthenticated: false });
    } else {
        res.send({ status: 200, isAuthenticated: true });
    }
}
module.exports={RegisterUser,LoginUser,VerifyToken,GetUser};