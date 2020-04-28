import React,{ useState, useContext } from 'react'
import car from '../assets/car.svg';
import image from '../assets/image.svg';
import { AiFillLock,AiOutlineUser } from "react-icons/ai";
import {userContext} from '../App'
import '../css/sign.css'
import {useHistory, Link} from 'react-router-dom'




const SignIn = (props) => {
    const[email,setEmail] =useState("");
    const[password,setPassword] =useState("");
    const {state, dispatch }= useContext(userContext)
    const[message,setMessage] = useState("")

    const history = useHistory()
    
    const PostData = ()=>{
        fetch('/api/signin',{
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({
                email,
                password
            })
        }).then(res=> res.json())
        .then(data=>{
            if(data.error){
              setMessage(data.error)
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("User",JSON.stringify(data.user))
                dispatch({type:"USER",payload: data.user});
                history.push('/')
               
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
                           <input type="text"
                            className="input"
                             placeholder="Email" value={email}
          onChange={(e)=>{setEmail(e.target.value)}} />
                       </div>    
                   </div>
                   <div className="input-div">
                       <div className="i">
                        <AiOutlineUser />
                       </div>
                       <div>
                           <input type="password"
                            className="input"
                             placeholder="Password"
                             value={password}
          onChange={(e)=>{setPassword(e.target.value)}} />
                       </div>    
                   </div>
                   <button type="submit" className="button" >login</button>
                   <p><Link to="/reset">Forget your password ?</Link></p>
                   {message && (<h2>{message}</h2>)}
               </form>
               <p className="bassem" onClick={()=>{window.open("https://www.linkedin.com/in/labbassi-bassem/",'_blank')}}>Developed by LABBASSI Bassem</p>
             
           </div>

 

       </div>
    )
}



export default SignIn
