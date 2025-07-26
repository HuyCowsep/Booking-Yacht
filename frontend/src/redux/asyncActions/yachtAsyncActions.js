import axios from "axios";
import {
  fetchYachtRequest,
  fetchYachtSuccess,
  fetchYachtFailure,
} from "../actions/yachtActions";

export const fetchYachtById = (yachtId) => async (dispatch) => {
  dispatch(fetchYachtRequest());
  try {
    const [yachtResponse, servicesResponse] = await Promise.all([
      axios.get(`http://localhost:9999/api/v1/yachts/findboat/${yachtId}`),
      axios.get(`http://localhost:9999/api/v1/yachts/${yachtId}/services`),
    ]);
    const yachtData = {
      ...yachtResponse.data.data,
      services: Array.isArray(servicesResponse.data?.data)
        ? servicesResponse.data.data
        : [],
    };
    dispatch(fetchYachtSuccess(yachtData));
  } catch (error) {
    dispatch(fetchYachtFailure(error.message));
  }
};
