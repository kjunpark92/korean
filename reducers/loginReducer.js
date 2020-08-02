let initialState = {
    loading: false,
    userData: "",
    error: null,
    loginStatus: false
  };
  
function login(state = initialState, action) {
  switch (action.type) {

    case "LOGIN_DATA":
      return {
        ...state,
        userData: action.userData,
        loginStatus: true
      };

    default:
      return state;
  }
}

export default login;

