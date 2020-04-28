const express = require('express'); 
const router = express.Router(); 
const Post = require('../Models/Post')
const requireLogin = require('../middleware/requireLogin')


//create a new post 
router.post('/api/createpost', requireLogin , (req,res)=>{

    const {title, body, pic } = req.body; 
    if(!title || !body || !pic)
    {
        res.status(422).json({error: "error geting post data"})
    }

    req.user.password = undefined
     const post = new Post({
         title, 
         body, 
         photo: pic,
         postedBy: req.user})

         post.save().then(user =>{
             res.json({message:"post was successfully created",post: user})
         }).catch(err=> console.log(err))





})

//geting all the posts
router.get('/api/showposts',requireLogin,(req,res)=>{
  Post.find()
  .populate("postedBy", "_id name photo")
  .populate("comments.postedBy","_id name")
  .then(postsList=>{
      res.json({posts: postsList})
  }).catch(err=> res.status(500).json({error: "error while fetching posts data"}))
})

//geting my posts 
router.get('/api/myposts', requireLogin , (req , res)=>{
  Post.find({postedBy: req.user._id})
  .populate("postedBy", "_id name")
  .then(postsList =>{
    res.status(200).json({posts: postsList})
  }).catch(err =>{
      res.status(400).json({error: "geting error while fetching posts data"})
  })
     
})

router.get('/api/getSubPost',requireLogin,(req,res)=>{
    
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name photo")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})
  

router.put('/api/like',requireLogin,(req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
      $push:{likes:req.user._id}
  },{
      new:true
  })
  .populate("comments.postedBy","_id name")
  .populate("postedBy", "_id name")
  .exec((err,result)=>{
      if(err){
          return res.status(422).json({error:err})
      }else{
          res.json(result)
      }
  })
})

router.put('/api/unlike',requireLogin,(req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
      $pull:{likes:req.user._id}
  },{
      new:true
  }).populate("comments.postedBy","_id name")
  .populate("postedBy", "_id name")
  .exec((err,result)=>{
      if(err){
          return res.status(422).json({error:err})
      }else{
          res.json(result)
      }
  })
})


router.put('/api/comment',requireLogin,(req,res)=>{
  const comment = {
    text: req.body.text, 
    postedBy: req.user
  }
  Post.findByIdAndUpdate(req.body.postId,{
      $push:{comments: comment}
  },{
      new:true
  })
  .populate("comments.postedBy","_id name")
  .populate("postedBy", "_id name")
  .exec((err,result)=>{
      if(err){
          return res.status(422).json({error:err})
      }else{
          res.json(result)
      }
  })
})

router.delete('/api/deletepost/:postId',requireLogin,(req,res)=>{
  Post.findOne({_id:req.params.postId})
  .populate("postedBy","_id")
  .exec((err,post)=>{
      if(err || !post){
          return res.status(422).json({error:err})
      }
      if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
      }
  })
})







module.exports = router