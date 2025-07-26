export const fetchYachtRequest = () => ({ type: "FETCH_YACHT_REQUEST" });
export const fetchYachtSuccess = (yacht) => ({
  type: "FETCH_YACHT_SUCCESS",
  payload: yacht,
});
export const fetchYachtFailure = (error) => ({
  type: "FETCH_YACHT_FAILURE",
  payload: error,
});
export const clearYacht = () => ({ type: "CLEAR_YACHT" });
