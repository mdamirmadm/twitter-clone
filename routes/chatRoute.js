const express = require('express');
const {isLoggedIn} = require('../middleware');
const Chat = require('../models/chats');
const router = express.Router();

router.get('/allmessages',isLoggedIn, async(req,res) => {
    try{
        const chats = await Chat.find({});

        res.json(chats);
    }
    catch(e){
        console.log(e);
        res.redirect('/error');
    }
   

})

router.get('/messages', isLoggedIn, (req,res) => {

    res.render('chatPage',{user: req.user});
})




module.exports = router;