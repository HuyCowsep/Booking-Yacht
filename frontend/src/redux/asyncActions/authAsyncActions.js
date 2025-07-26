import { setAuthenticated } from "../actions/authActions";

export const initializeAuth = () => (dispatch) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("customer");

  if (token && user) {
    try {
      const userData = JSON.parse(user);
      dispatch(setAuthenticated(userData));
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("customer");
      dispatch({ type: "CHECK_AUTH_STATUS" });
    }
  } else {
    dispatch({ type: "CHECK_AUTH_STATUS" }); // Không có token vẫn cần set authChecked = true
  }
};

export const fetchCustomerIdFromStorage = () => (dispatch) => {
  try {
    const customerData = localStorage.getItem("customer");
    if (customerData) {
      const parsedCustomer = JSON.parse(customerData);
      dispatch(setAuthenticated(parsedCustomer));
      return parsedCustomer;
    }
    return null;
  } catch (error) {
    console.error("Error fetching customer from storage:", error);
    return null;
  }
};
