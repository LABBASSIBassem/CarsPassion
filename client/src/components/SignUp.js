import React , {useState,useEffect }from 'react'
import car from '../assets/SIGNUP.svg';
import image from '../assets/image.svg';
import { AiFillLock,AiOutlineUser,AiTwotoneMail } from "react-icons/ai";
import {useHistory} from 'react-router-dom'
import '../css/sign.css'

const SignUp = (props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const[message,setMessage] = useState("")
    const [imageState, setImageState] =useState('')
    const [url, setUrl] =useState('')
    const history = useHistory()

    useEffect(() => {
        if(url){
      PostData()
        }},[url])
    
     
    const uploadImage = (e) =>{
        e.preventDefault();
        const data = new FormData();
        data.append("file",imageState)
        data.append("upload_preset","carspassion")
        data.append("cloud_name","bassem")

        fetch("https://api.cloudinary.com/v1_1/bassem/image/upload",{
            method: "POST", 
            body: data
        }).then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>console.log(err))
    }


     const PostData = () =>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            setMessage("invalid email") 
         }else{
        fetch("/api/signup",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({
                name,
                email,
                password,
                pic: url
            })}).then(res=>res.json())
        .then(data =>{
            if(data.error)
            {
         setMessage(data.error)
    
            }
            else{
                history.push('/signin')
            }
    
        })
    }
    }
  
    return (
            <div className="container">
           <div className="img">
               <img src={car} />
           </div>
           <div className="login-container">
               <form className="form" onSubmit={uploadImage}>
                   <img src={image} className="avatar"/>
                   <h5>WELCOME</h5>
                   <div className="input-div">
                       <div className="i">
                         <AiFillLock />
                       </div>
                       <div>
                           <input type="text"
                            className="input"
                             placeholder="Name"
                             value={name}
               onChange={(e)=>{setName(e.target.value)}} />
                       </div>    
                   </div>
                   <div className="input-div">
                       <div className="i">
                        <AiTwotoneMail />
                       </div>
                       <div>
                           <input type="text"
                            className="input"
                             placeholder="Email" 
                             value={email}
              onChange={(e)=>{setEmail(e.target.value)}}/>
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
                   <div>
                   <label for="files" className="label-input">Select Image</label>
                           <input type="file" 
                           className="input"
                           id="files"
                           style={{visibility: "hidden"}}
                           placeholder="Add you'r profile image"
              onChange={(e)=>{setImageState(e.target.files[0])
                console.log(e.target.files,"aoejpoejpae")
              }} />
                       </div>   
                   <button type="submit" className="button">Sign Up</button>
                   {message && (<h2>{message}</h2>)}
               </form>
           </div>



       </div>
    )
}


export default SignUp 