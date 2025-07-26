// // === IMAGE REDUCER ===
const initialState = {
  images: [],
  currentIndex: 0,
  isHovering: false,
  loading: false,
  error: null,
};

const imageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_IMAGES_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_IMAGES_SUCCESS":
      return { ...state, loading: false, images: action.payload, error: null };
    case "FETCH_IMAGES_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "SET_CURRENT_IMAGE_INDEX":
      return { ...state, currentIndex: action.payload };
    case "NEXT_SLIDE":
      return { ...state, currentIndex: (state.currentIndex + 1) % state.images.length };
    case "PREV_SLIDE":
      return {
        ...state,
        currentIndex: (state.currentIndex - 1 + state.images.length) % state.images.length,
      };
    case "SET_IMAGE_HOVERING":
      return { ...state, isHovering: action.payload };
    default:
      return state;
  }
};

export default imageReducer;
export { initialState }; // Export initialState để dùng ở nơi khác nếu cần
