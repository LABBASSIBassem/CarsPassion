import React,{useEffect, useState, useContext} from 'react'
import image from '../assets/car.svg'
import {userContext} from '../App'
import { useParams } from 'react-router-dom'


const UserProfile = () => {
    const [profile, setProfile] = useState(null)
    const {state, dispatch }= useContext(userContext)
    const {userId} = useParams()
    const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userId): true)
    useEffect(()=>{
        fetch(`/api/user/${userId}`,{ 
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            
            }}).then(res=> res.json())
            .then(data=>{
             setProfile(data)
            })

    },[])

    const followUser = (followId) =>{
        fetch(`/api/follow`,{ 
            method: "put",
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            
            }, 
            body:JSON.stringify({
             "followId": followId
            })
        }).then(res=> res.json())
            .then(data=>{
            dispatch({type:"UPDATE",payload:{following: data.following, followers: data.followers}})
            localStorage.setItem("User",JSON.stringify(data))
            setProfile((prevState)=>{
                return { ...prevState, 
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                 
                }
             })
             setShowFollow(false)
            })
    }
    
    const unfollowUser = (unfollowId) =>{
        fetch(`/api/unfollow`,{ 
            method: "put",
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            
            }, 
            body:JSON.stringify({
             "unfollowId": unfollowId
            })
        }).then(res=> res.json())
            .then(data=>{
                
            dispatch({type:"UPDATE",payload:{following: data.following, followers: data.followers}})
            localStorage.setItem("User",JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollowers = prevState.user.followers.filter(item=> item != data._id)
                return { ...prevState, 
                    user:{
                        ...prevState.user,
                        followers: newFollowers
                    }
                 
                }
             })
             setShowFollow(true)
             
            })
          

    }
    



    return (
        <div >
            <div className="container-profile">
                <div>
                    <img src={profile && profile.user.photo} className="profile-image"/>
                </div>
                <div className="profile-content">
                    <h4 className="name-profile">{profile ? profile.user.name: "loading"}</h4>
                    <div className="profile-info-prof">
                        <h5>{profile && profile.posts.length } Posts</h5>
                        <h5>{profile && profile.user.followers.length} folowers</h5>
                        <h5>{profile && profile.user.following.length} following</h5>
                        
                    </div>
                    <div>{
                        showFollow ?  <button className="button-follow" onClick={()=>{followUser(userId)}}>follow</button>
                        :  <button className="button-follow"  onClick={()=>{ unfollowUser(userId)}}>unfollow</button>
                        }
                    </div>
                </div>
            </div>
           <div className="gallery-profile">
           {
                   profile ? profile.posts.map(item=>{
                   return( <img className="item-profile" src={item.photo} alt={item.body} key={item._id} />)
                   }) :<p>haw jey</p>
               }
               
           </div>
            </div>
    )
}



export default UserProfile