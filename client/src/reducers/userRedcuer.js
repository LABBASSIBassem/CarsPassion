export const initalState = null

export const reducer = (state= initalState, action) =>{
   if(action.type == "USER")
    {
        return action.payload
    }
    if(action.type == "LOGOUT")
    {
        return null
    }

    if(action.type== "UPDATE"){
      return {
        ...state, 
        followers:action.payload.followers,
        following: action.payload.following
       
      }
    }
  return state
}