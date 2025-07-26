const reviewFormInitialState = {
  userRating: 0,
  description: "",
  isSubmitting: false,
  error: null,
};

const reviewFormReducer = (state = reviewFormInitialState, action) => {
  switch (action.type) {
    case "SET_USER_RATING":
      return { ...state, userRating: action.payload };
    case "SET_REVIEW_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SUBMIT_REVIEW_REQUEST":
      return {
        ...state,
        isSubmitting: true,
        error: null,
      };
    case "SUBMIT_REVIEW_SUCCESS":
      return {
        ...state,
        isSubmitting: false,
        error: null,
      };
    case "SUBMIT_REVIEW_FAILURE":
      return {
        ...state,
        isSubmitting: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default reviewFormReducer;
