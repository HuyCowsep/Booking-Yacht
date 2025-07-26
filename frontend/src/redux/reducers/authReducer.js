const authInitialState = {
  isAuthenticated: false,
  customer: null,
  customerId: null,
  authChecked: false,
};

const authReducer = (state = authInitialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "SET_AUTHENTICATED":
      return {
        ...state,
        isAuthenticated: true,
        customer: action.payload,
        customerId: action.payload.customerId || action.payload.id || action.payload._id || null,
        authChecked: true,
      };
    case "SET_CUSTOMER_ID":
      return {
        ...state,
        customerId: action.payload,
      };
    case "CHECK_AUTH_STATUS":
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("customer");
      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          return {
            ...state,
            isAuthenticated: true,
            customer: parsedUser,
            customerId: parsedUser.customerId || parsedUser.id || parsedUser._id || null,
            authChecked: true,
          };
        } catch (error) {
          return state;
        }
      }
      return state;
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("customer");
      return {
        ...state,
        isAuthenticated: false,
        customer: null,
        customerId: null,
        authChecked: true,
      };
    default:
      return state;
  }
};

export default authReducer;
