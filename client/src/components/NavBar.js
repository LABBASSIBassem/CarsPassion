import React,{useContext}  from 'react'
import { userContext } from '../App'
import {Link , useHistory} from 'react-router-dom'
import '../css/nav.css'
import uuid from 'react-uuid'
 const NavBar = () => {

    const {state, dispatch} = useContext(userContext)
    const history = useHistory();
    const renderList = ()=>{
        if(state){
          return([
            <li key={uuid()}><Link to='/profile'>Profile</Link></li>,
             <li key={uuid()}><Link to='/createpost'>Create Post</Link></li>,
             <li key={uuid()}><Link to='/myfollowingposts'> My Following Posts</Link></li>,
             <li key={uuid()}><button className="button1" onClick={()=>{
               localStorage.clear()
               dispatch({type: "LOGOUT"})
               history.push('/signin')
       
               }} >Logout</button></li>
          ]) 
        }
        else{
          return(
            [<li key={uuid()}><Link to='/signin'>SignIn</Link></li>,
            <li key={uuid()}><Link to='/signup'>SignUp</Link></li>]
          )
        }
      }

    return (
      <header>
      <h2 alt="logo" className="logo"><Link to={state ? "/" : "/signin"}>CarsPassion</Link></h2>
      <nav>
          <ul className="nav_links">
              {renderList()}
          </ul>
      </nav>
      </header>
    )
}

export default NavBar