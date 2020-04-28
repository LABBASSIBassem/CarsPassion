import React,{useEffect, useState, useContext}  from 'react'
import { AiFillLike , AiFillDislike,AiFillDelete} from "react-icons/ai";
import {userContext} from '../App'
import '../css/home.css'
import {Link} from "react-router-dom"

const Home = () => {
    const [data,setData] = useState([]);
    const {state, dispatch} =useContext(userContext)
    useEffect(() => {
        fetch('/api/showposts',{
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${localStorage.getItem("jwt")}`
              }, 
          }).then(res=> res.json())
         .then(result=>{
        setData(result.posts)
      })
              
   }, [])

   const likePost = (id) =>{
       fetch('/api/like', {
           method: "put",
           headers:{
               "Content-Type": "application/json",
               "Authorization": `Bearer ${localStorage.getItem("jwt")}`
           }, 
           body:JSON.stringify({
               postId: id
           })
       }).then(res=> res.json())
       .then(result=>{
        const newData = data.map(item=>{
            if(item._id == result._id){
                return result
            }else{
                return item
            }
        })
        setData(newData)
       })

   }

   const unlikePost = (id)=>{
    fetch('/api/unlike', {
        method: "put",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        }, 
        body:JSON.stringify({
            postId: id
        })
    }).then(res=> res.json())
    .then(result=>{
        const newData = data.map(item=>{
            if(item._id == result._id){
                return result
            }else{
                return item
            }
        })
        setData(newData)
    })

}

const comment = (text,postId) =>{
    fetch('/api/comment', {
        method: "put",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        }, 
        body:JSON.stringify({
            postId: postId, 
            text:text
        })
    }).then(res=> res.json())
    .then(result=>{
     const newData = data.map(item=>{
         if(item._id == result._id){
             return result
         }else{
             return item
         }
     })
     setData(newData)
    })
}

const deleteComment = (postId) =>{
    fetch(`/api/deletepost/${postId}`, {
        method: "delete",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        }, 
    }).then(res=> res.json())
    .then(result=>{
        const newData = data.filter(item=>{
            return item._id != result._id
        })
        setData(newData)
    })
}
    return (
        <div className="container_card">
        {
            data.length ?    (
                
                data.map(item=>{
                    return(
                        
         <div className="card" key={item._id}>
             <div className="card-header">
                     <img className="profile-img" src={item.postedBy.photo} />
                 <div className="profile-info"> 
                   <div className="name-home"><Link className="link-profile" to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile"}>
                   {item.postedBy.name}</Link></div> 
                 </div>
                 {item.postedBy._id == state._id && <div className="icon-delete">
                 <AiFillDelete onClick={()=>{deleteComment(item._id)}} />
                     </div> }
             </div>
             <div className="content">
                 <img src={item.photo}  />
             </div>
             <div className="card-footer">
                 <div className="likes">
                 {item.likes.length} likes
                 </div>
                 <div className="description">
                     <p><span className="username" >{item.postedBy.name}</span>{item.title}</p>
                     <p>{item.body}</p>
                 </div>
                 <div className="comments">
                     {
                         item.comments.length >0 && item.comments.map(DATA=>{
                             return(
                                <p className="content-user"><span className="username">{DATA.postedBy.name}</span>{DATA.text}</p>
                             )
                           
                         })
                         
                         }
                
                </div>
                <hr/>
               
                    { item.likes.includes(state._id) ? (<div className="heart">
                    <AiFillDislike onClick={()=>{unlikePost(item._id)}}  />
                    </div>) : (<>
                        <div className="heart">
                    <AiFillLike onClick={()=>{likePost(item._id)}} />
                    </div>
                    <div className="heart">
                    <AiFillDislike onClick={()=>{unlikePost(item._id)}}  />
                    </div></>) }
                    <form onSubmit={(e)=>{
                        e.preventDefault();
                        comment(e.target[0].value,item._id)
                        }}>
                    <div className="add-comment">
                        <input type="text" className="input_field" placeholder="add a comment"/>
                    </div>  
                 </form>
             </div>
         </div>
     )})): (<p>loading ...</p>)

        }
     
     </div>
    )

}
    


export default Home