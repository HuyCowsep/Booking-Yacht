// === YACHT REDUCER ===
const yachtInitialState = {
  currentYacht: null,
  loading: false,
  error: null,
};

const yachtReducer = (state = yachtInitialState, action) => {
  switch (action.type) {
    case "FETCH_YACHT_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_YACHT_SUCCESS":
      return { ...state, loading: false, currentYacht: action.payload };
    case "FETCH_YACHT_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "CLEAR_YACHT":
      return { ...state, currentYacht: null };
    default:
      return state;
  }
};

export default yachtReducer;
