import React,{ useState, useContext } from 'react'
import car from '../assets/car.svg';
import image from '../assets/image.svg';
import { AiOutlineUser } from "react-icons/ai";
import '../css/sign.css'
import {useHistory} from 'react-router-dom'




const Reset = (props) => {
    const[email,setEmail] =useState("");
    const[message,setMessage] = useState("")

    const history = useHistory()
    
    const PostData = ()=>{
        fetch('/api/forgetpassword',{
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({
                email,
            })
        }).then(res=> res.json())
        .then(data=>{
            if(data.error){
              setMessage(data.error)
            }
            else{   
                setMessage(data.message)
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
                         <AiOutlineUser />
                       </div>
                       <div>
                           <input type="text"
                            className="input"
                             placeholder="Email" value={email}
          onChange={(e)=>{setEmail(e.target.value)}} />
                       </div>    
                   </div>
                   <button type="submit" className="button" >Reset Password</button>
                   {message && (<h2>{message}</h2>)}
               </form>    
           </div>

 

       </div>
    )
}



export default Reset
