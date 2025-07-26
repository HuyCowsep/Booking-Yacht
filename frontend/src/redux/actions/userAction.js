import { CUSTOMER_REGISTER, FETCH_USER_LOGIN_SUCCES, USER_LOGOUT, UPDATE_CUSTOMER_PROFILE } from "../type/Type";

export const doLogin = (data, role, idCompany, idCustomer, customer) => {
  return {
    type: FETCH_USER_LOGIN_SUCCES,
    payload: { data, role, idCompany, idCustomer, customer },
  };
};

export const doRegister = () => {
  return {
    type: CUSTOMER_REGISTER,
  };
};

export const doLogout = () => {
  return {
    type: USER_LOGOUT,
  };
};

export const updateCustomerProfile = (customer) => {
  return {
    type: UPDATE_CUSTOMER_PROFILE,
    payload: customer,
  };
};