import { ADMIN_LOGIN_SUCCESS, ADMIN_LOGOUT } from "../type/Type";

const INITIAL_STATE = {
  adminAccount: {
    data: "",
    role: "",
    token: "",
  },
  isAuthenticated: false,
};

const adminReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADMIN_LOGIN_SUCCESS:
      return {
        ...state,
        adminAccount: {
          data: action.payload.adminData,
          role: action.payload.role,
          token: action.payload.token,
        },
        isAuthenticated: true,
      };
    case ADMIN_LOGOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default adminReducer;
