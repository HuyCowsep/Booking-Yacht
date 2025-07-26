import axios from "axios";

export const fetchServices = (yachtId) => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_SERVICES_REQUEST" });
    const response = await axios.get(
      `http://localhost:9999/api/v1/yachts/${yachtId}/services`
    );
    const servicesData = Array.isArray(response.data?.data)
      ? response.data.data
      : [];
    dispatch({ type: "FETCH_SERVICES_SUCCESS", payload: servicesData });
  } catch (error) {
    dispatch({ type: "FETCH_SERVICES_FAILURE", payload: error.message });
  }
};
