import React ,{ useState , useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import '../css/createPost.css'

const CreatePost = (props) => {
        const [title, setTitle] =useState('')
        const [body, setBody] =useState('')
        const [image, setImage] =useState('')
        const [url, setUrl] =useState('')
        const [message, setMessage]=useState('')
        const history = useHistory()

        useEffect(() => {
            if(url){
            fetch('/api/createpost',{
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                }, 
                body: JSON.stringify({
                   title, 
                   body,
                   pic : url 
                })
            }).then(res=> res.json())
            .then(data=>{
                if(data.error){
                   setMessage(data.error)
                }
                else{
                    history.push('/')
                }
            })
        }
    
             },[url])
              const postDetails = () =>{
                const data = new FormData();
                data.append("file",image)
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

            const handleSubmit = (e) =>{
                e.preventDefault();
                postDetails();
            }
    return (
        <div className="container-post">
    
            <div className="container-content-post">
                <form onSubmit={handleSubmit}>
                <div className="title-post">
                    <input type="text" placeholder="Title"
                     className="input-post" 
                     value={title} 
                     onChange={(e)=>{setTitle(e.target.value)}}
                     />
                </div>
                <div className="body-post">
                    <input type="text" placeholder="Content" 
                    className="input-post"
                    value={body} 
                    onChange={(e)=>{setBody(e.target.value)}} />
                </div>
                <label className="new-button" for="upload"> Upload file </label>
                 <input id="upload" type="file"
                   className="file-post"
                   onChange={(e)=>{setImage(e.target.files[0])}}/>
                <button className="file-button" type="submit">Create</button>
                {message && (<h2>{message}</h2>)}
                </form>
                
               
            </div>
            
        </div>
    )
}



export default CreatePost;