export const fetchReviewsRequest = () => ({ type: "FETCH_REVIEWS_REQUEST" });
export const fetchReviewsSuccess = (reviewsData) => ({
  type: "FETCH_REVIEWS_SUCCESS",
  payload: reviewsData,
});
export const fetchReviewsFailure = (error) => ({
  type: "FETCH_REVIEWS_FAILURE",
  payload: error,
});
export const setReviewSearchTerm = (term) => ({
  type: "SET_REVIEW_SEARCH_TERM",
  payload: term,
});
export const setReviewCurrentPage = (page) => ({
  type: "SET_REVIEW_CURRENT_PAGE",
  payload: page,
});
export const fetchYachtImages = (yachtId) => ({
  type: "FETCH_YACHT_IMAGES",
  payload: yachtId,
});
export const fetchReviews = (yachtId, page = 1, search = "") => ({
  type: "FETCH_REVIEWS",
  payload: { yachtId, page, search },
});
export const submitReview = (reviewData) => ({
  type: "SUBMIT_REVIEW",
  payload: reviewData,
});
export const setUserRating = (rating) => ({
  type: "SET_USER_RATING",
  payload: rating,
});
export const setReviewDescription = (description) => ({
  type: "SET_REVIEW_DESCRIPTION",
  payload: description,
});
export const submitReviewRequest = () => ({ type: "SUBMIT_REVIEW_REQUEST" });
export const submitReviewSuccess = () => ({ type: "SUBMIT_REVIEW_SUCCESS" });
export const submitReviewFailure = (error) => ({
  type: "SUBMIT_REVIEW_FAILURE",
  payload: error,
});
