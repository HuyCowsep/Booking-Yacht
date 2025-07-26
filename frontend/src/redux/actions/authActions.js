export const checkAuthStatus = () => ({ type: "CHECK_AUTH_STATUS" });
export const setAuthenticated = (user) => ({
  type: "SET_AUTHENTICATED",
  payload: user,
});
export const loginRequest = () => ({ type: "LOGIN_REQUEST" });
export const loginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});
export const loginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
});
export const logout = () => ({ type: "LOGOUT" });
export const registerRequest = () => ({ type: "REGISTER_REQUEST" });
export const registerSuccess = (user) => ({
  type: "REGISTER_SUCCESS",
  payload: user,
});
export const registerFailure = (error) => ({
  type: "REGISTER_FAILURE",
  payload: error,
});
export const clearAuthError = () => ({ type: "CLEAR_AUTH_ERROR" });
export const setCustomerId = (customerId) => ({
  type: "SET_CUSTOMER_ID",
  payload: customerId,
});
