// === REVIEWS REDUCER ===
const reviewsInitialState = {
  reviews: [],
  ratingData: {
    total: 0,
    average: 0,
    distribution: [],
  },
  currentPage: 1,
  totalPages: 1,
  searchTerm: "",
  loading: false,
  error: null,
};

const reviewsReducer = (state = reviewsInitialState, action) => {
  switch (action.type) {
    case "FETCH_REVIEWS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_REVIEWS_SUCCESS":
      return {
        ...state,
        loading: false,
        reviews: action.payload.reviews || [],
        ratingData: action.payload.ratingData || state.ratingData,
        currentPage: action.payload.currentPage || 1,
        totalPages: action.payload.totalPages || 1,
      };
    case "FETCH_REVIEWS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
        reviews: [],
      };
    case "SET_REVIEW_SEARCH_TERM":
      return { ...state, searchTerm: action.payload, currentPage: 1 };
    case "SET_REVIEW_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SUBMIT_REVIEW_SUCCESS":
      return { ...state };
    default:
      return state;
  }
};

export default reviewsReducer;
