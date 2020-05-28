
const jwt = require('jsonwebtoken');
require('dotenv').config();

var secure = (req, res, next) => {
    var id = req.cookies.id;
    if(!id) {
        return res.send("unauthorized");
    } 
    try{
        id = jwt.verify(id, process.env.SECRET);
    } catch(error){
        res.send("unauthorized");
    }
    next();
}

module.exports = secure;