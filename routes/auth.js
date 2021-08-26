const express = require('express');
const User = require('../models/users');
const passport = require('passport');
const router = express.Router();
const {isLoggedIn} = require('../middleware');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');


//Get the sign up/register form
router.get('/register', (req,res) => {
    res.render('auth/register',{message:req.flash('error')});
})

//registering the user
router.post('/register', upload.single('profilePic'), async(req,res) => {
    try{
        const result = await cloudinary.uploader.upload(req.file.path);
        console.log(result);
        const user = {
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            email: req.body.email,
            username: req.body.username,
            profilePic: result.secure_url,
            cloudinary_id: result.public_id
        }
    
        const password = req.body.password;
    
        const newUser = await User.register(user,password);
    
        res.redirect('/');
    }
    catch(e){
        console.log(e)
        req.flash('error',e.message);
        res.redirect('/register');
    }
})


//get the login page
router.get('/login', (req,res) => {
    res.render('auth/login');
})


//logging the user in
router.post('/login',passport.authenticate('local',{
    failureRedirect: '/login',
    failureFlash: true
}), (req,res) => {
    res.redirect('/');
})

//logging out the user
router.get('/logout', (req,res) => {
    req.logout();
    req.flash("success","Logged Out Successfully!");
    res.redirect('/login');
})

module.exports = router;