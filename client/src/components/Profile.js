import React,{useEffect, useState, useContext} from 'react'
import image from '../assets/car.svg'
import {userContext} from '../App'
import '../css/Profile.css'

const Profile = () => {
  const [posts, setPosts] = useState([])
  const {state, dispatch }= useContext(userContext)
    useEffect(()=>{
        fetch('/api/myposts',{ 
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            
            }}).then(res=> res.json())
            .then(data=>{setPosts(data.posts)})

    },[])
    console.log(state,"this is the loged user")
    return (
    <div >
            <div className="container-profile">
                <div>
                    <img src={state && state.photo } className="profile-image"/>
                </div>
                <div className="profile-content">
                    <h4 className="name-profile">{state ? state.name : "loading"}</h4>
                    <div className="profile-info-prof">
                        <h5>{posts.length || 0} Posts</h5>
                        <h5>{state && state.followers.length} followers</h5>
                        <h5>{state && state.following.length} following</h5>
                    </div>
                </div>
            </div>
           <div className="gallery-profile">
               {
                   posts.length ? posts.map(item=>{
                   return( <img className="item-profile" src={item.photo} alt={item.body} key={item._id} />)
                   }) : <p>loading ...</p>
               }
               
           </div>
            </div>
    )
}



export default Profile
