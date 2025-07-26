export const fetchImagesRequest = () => ({ type: "FETCH_IMAGES_REQUEST" });
export const fetchImagesSuccess = (images) => ({
  type: "FETCH_IMAGES_SUCCESS",
  payload: images,
});
export const fetchImagesFailure = (error) => ({
  type: "FETCH_IMAGES_FAILURE",
  payload: error,
});
export const setCurrentImageIndex = (index) => ({
  type: "SET_CURRENT_IMAGE_INDEX",
  payload: index,
});
export const nextSlide = () => ({ type: "NEXT_SLIDE" });
export const prevSlide = () => ({ type: "PREV_SLIDE" });
export const setImageHovering = (isHovering) => ({
  type: "SET_IMAGE_HOVERING",
  payload: isHovering,
});
