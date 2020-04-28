import React,{createContext, useReducer, useEffect, useContext} from 'react';
import {SignIn, SignUp, Home ,NavBar, CreatePost, Profile, UserProfile, MyFollowingPosts
   , Reset , NewPassword} from './components'
import {Route, useHistory,Switch} from 'react-router-dom'
import './App.css';
import { initalState , reducer } from './reducers/userRedcuer';
export const userContext = createContext();

const Routing = ()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(userContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("User"))
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      if(!history.location.pathname.startsWith('/reset')){
        history.push('/signin')
      }
     
    }
  },[])
  return(
    <Switch>
      <Route exact path="/" >
      <Home />
      </Route>
      <Route path="/signin">
        <SignIn />
      </Route>
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/createpost">
        <CreatePost/>
      </Route>
      <Route path="/profile/:userId">
        <UserProfile />
      </Route>
      <Route path="/myfollowingposts">
        <MyFollowingPosts />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <NewPassword />
      </Route>
      
    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initalState)
  return (
    <userContext.Provider value={{state,dispatch}}>
      <NavBar />
      <Routing />
    </userContext.Provider>)
}

export default App