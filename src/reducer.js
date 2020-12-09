
export const initialState = {
    user: null,
    allUserDetails:null
  };
  
export const actionTypes = {
    SET_USER:'SET_USER',
    SET_ALLUSERDETAILS:'SET_ALLUSERDETAILS'
}
  const reducer = (state, action) => {
    console.log(action);
  
    // action -> type, [payload]
  
    switch (action.type) {
      case "SET_USER":
        return {
          ...state,
          user: action.user,
        };
        case 'SET_ALLUSERDETAILS':
          return{
            ...state,
            allUserDetails:action.allUserDetails
          }
  
      default:
        return state;
    }
  };
  
  export default reducer;