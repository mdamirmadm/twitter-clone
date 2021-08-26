const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware');
const Post = require('../models/post');
const User = require('../models/users');

router.get('/profile', isLoggedIn, (req,res) => {

    const payload = {
        user: req.user,
        displayName: req.user.firstName+ " " + req.user.lastName
    }

    res.render('profile', { payload });
})

router.get('/profile/:username', isLoggedIn, async(req,res) => {

    const user = await User.findOne({username:req.params.username});

    const payload = {
        user: user,
        displayName: user.firstName+ " " + user.lastName
    }

    res.render('profile', { payload });
})


router.get('/follow/:userId/:profileId', isLoggedIn, async(req,res) => {

    const {userId,profileId} = req.params;
    console.log(req.user.following);
    let isfollowed = req.user.following && req.user.following.includes(profileId);
    console.log(isfollowed);
    let option = isfollowed? '$pull': '$addToSet';
    console.log(option);

    try{
        currentUser = await User.findByIdAndUpdate(userId,{[option]:{following: profileId}},{new: true});

        const profileUser = await User.findByIdAndUpdate(profileId,{[option]:{followers: userId}},{ new: true});

        let followBtn='follow';
        if(option==='$addToSet'){
            followBtn = 'Unfollow';
        }

        return res.redirect(`/profile/${profileUser.username}`);
    }
    catch(e){
        console.log(e);
    }
   
    res.send('Error');
})

module.exports = router;