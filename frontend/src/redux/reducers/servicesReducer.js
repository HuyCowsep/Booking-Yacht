//=== SERVICES REDUCER ===
const servicesInitialState = {
  data: [],
  loading: false,
  error: null,
};

const servicerReducer = (state = servicesInitialState, action) => {
  switch (action.type) {
    case "FETCH_SERVICES_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_SERVICES_SUCCESS":
      return { ...state, data: action.payload, loading: false };
    case "FETCH_SERVICES_FAILURE":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default servicerReducer;
