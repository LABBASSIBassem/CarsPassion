
import React,{ useState, useContext } from 'react'
import car from '../assets/car.svg';
import image from '../assets/image.svg';
import { AiFillLock } from "react-icons/ai";
import '../css/sign.css'
import {useHistory, useParams} from 'react-router-dom'


const NewPassword = (props) => {
    const[password,setPassword] =useState("");
    const[message,setMessage] = useState("")
  const {token} = useParams();
    const history = useHistory()
    
    const PostData = ()=>{
        fetch('/api/newpassword',{
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({
                password,
                token
            })
        }).then(res=> res.json())
        .then(data=>{
            if(data.error){
              setMessage(data.error)
            }
            else{   
                history.push('/signin')
            }
        })

    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        PostData()
    }
    return (
       <div className="container">
           <div className="img">  
               <img src={car} />
           </div>
           <div className="login-container">
               <form className="form" onSubmit={handleSubmit}>
                   <img src={image} className="avatar"/>
                   <h5>WELCOME</h5>
                   <div className="input-div">
                       <div className="i">
                        <AiFillLock />
                       </div>
                       <div>
                           <input type="password"
                            className="input"
                             placeholder="Password"
                             value={password}
          onChange={(e)=>{setPassword(e.target.value)}} />
                       </div>    
                   </div>
                   <button type="submit" className="button" >New Password</button>
                   {message && (<h2>{message}</h2>)}
               </form>    
           </div>

 

       </div>
    )
}



export default NewPassword
