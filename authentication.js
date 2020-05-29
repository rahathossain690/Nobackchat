
const jwt = require('jsonwebtoken');
const database = require('./database')
require('dotenv').config();

var secure = async (req, res, next) => {
    var id_ = req.cookies.session;
    if(!id_) {
        return res.send("unauthorized");
    } 
    try{
        id_ = jwt.verify(id_, process.env.SECRET);
        const result = await database.getUser({id: id_});
        if(result.isverified == false){
            var final = {
                username : result.username,
                isverified: result.isverified,
                extra: result.extra,
                id: result._id
            }
            res.send(final);
        }
    } catch(error){
        res.send("unauthorized");
    }
    next();
}

module.exports = secure;