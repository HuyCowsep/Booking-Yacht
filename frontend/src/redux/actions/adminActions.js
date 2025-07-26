import { ADMIN_LOGIN_SUCCESS, ADMIN_LOGOUT } from "../type/Type";

export const doAdminLogin = (adminData, role, token) => {
  return {
    type: ADMIN_LOGIN_SUCCESS,
    payload: { adminData, role, token },
  };
};

export const doAdminLogout = () => {
  return {
    type: ADMIN_LOGOUT,
  };
};
