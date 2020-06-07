
const jwt = require('jsonwebtoken');
const database = require('./database')
require('dotenv').config();

module.exports = async (req, res, next) => {
    var id_ = req.cookies.session;
    try{
        id_ = jwt.verify(id_, process.env.SESSION_SECRET);
        const result = await database.check_user_by_id({id: id_});
        req.locals = result;
    } catch(error){

    }
    next();
}