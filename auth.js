
const route = require('express').Router();
// const mail = require('./mail')
const validation = require('./validation')
const database = require('./database')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const authentication = require('./authentication');

// TODO: Add email verification
// TODO: Reset password

route.post('/signup', authentication, async (req, res) => {
    if(!!req.locals){ // already signed in
        res.send(403).send();
        return;
    }
    data = req.body; // data should be valid according to validation.signin schema model
    const invalid = validation.signup(data); // calling validation
    if(invalid){ // if invalid
        res.status(409).send( invalid );
        return;
    }
    try{
        if(!!await database.check_user_by_email({email: data.email}) ){ // email already in use
            res.status(409).send("Already exists");
            return;
        }
        const user = await database.create_user(data); // create user
        const token = jwt.sign({
            uid: user._id
          }, process.env.EMAIL_SECRET, { expiresIn: 5 * 60 });
        const link = 'http://' + req.get('host') + '/api/auth/verify/' + token;
        mail.send_verification_mail({email: data.email, link: link}); // send verification email:: async
        res.status(200).send();
    } catch(err){
        res.status(400).send();
    }
})

route.post('/signin', authentication, async (req, res) => {
    if(!!req.locals){ // already signed in
        res.send(403).send();
        return;
    }
    data = req.body;
    var invalid = validation.signin(data); // checking validity 
    if(invalid) {
        res.status(409).send(invalid);
        return;
    }
    var user = await database.check_user_by_email_password(data); // get user from db
    if(!user){ // no such user
        res.send(404).send();
        return;
    }
    // TODO: to be uncommented later
    if(!user.isverified){ // not verified email
        res.status(401).send();
        return;
    }
    const token = jwt.sign({
        uid: user._id
      }, process.env.SESSION_SECRET)
    res.cookie('session', token);
    res.status(200).send();
});

route.get('/verify/:token', authentication, async (req, res) => {
    if(!!req.locals){ // already signed in
        res.send(403).send();
        return;
    }
    const token = req.params.token;
    try{
        const uid = jwt.verify(token, process.env.EMAIL_SECRET).uid;
        await database.verify_user_by_id({id: uid});
        res.send(); // redirecting to a site
    }catch(err){
        res.status(403).send();
    }
});

route.get('/signout', authentication, async(req, res) => {
    res.clearCookie('session');
    res.send();
})

module.exports = route;