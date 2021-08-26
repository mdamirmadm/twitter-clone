const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../../middleware');
const Post = require('../../models/post');
const User = require('../../models/users');

//getting all the posts
router.get('/api/post',isLoggedIn, async(req,res) => {
    const filter = req.query

    const results = await Post.find(filter).populate('postedBy').populate('replyTo');
    
    const posts =  await User.populate(results,{path:'replyTo.postedBy'});

    res.json(posts);
})

router.get('/api/post/:id', isLoggedIn, async(req,res) => {
    const postData = await Post.findById(req.params.id).populate('postedBy');

    res.status(200).json(postData);
})


//creating and uploading a post
router.post('/api/post', isLoggedIn, async(req,res) => {
    try{
        let createdPost = {
            postedBy: req.user,
            content: req.body.content
        }
    
        if(req.body.replyTo){
            createdPost = {
                  ... createdPost,
                replyTo: req.body.replyTo
            }
          
        }
    
        const newPost = await Post.create(createdPost);
        console.log(newPost);
        res.json(newPost);
    }
    catch(e){
        console.log(e);
        req.flash("error","Some problem occurred!")
        res.redirect('/api/post');
    }
    
})

//adding and removing like
router.patch('/api/post/:id/like', isLoggedIn , async(req,res) => {
    try{
        const postId = req.params.id;

        const userId = req.user._id;
        
        const isLiked = req.user.likes && req.user.likes.includes(postId);

        const option = isLiked ? '$pull':'$addToSet';

        req.user = await User.findByIdAndUpdate(userId,{[option]:{likes:postId}},{new:true})

        const post = await Post.findByIdAndUpdate(postId,{[option]:{likes:userId}},{new:true})

        res.status(200).json(post);
    }
    catch(e){
        console.log(e);
        req.flash('error',"Some Problem Occurred!")
        res.redirect('/api/post');
    }
    
})

module.exports = router;