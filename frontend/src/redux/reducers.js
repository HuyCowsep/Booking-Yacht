const initialState = {
  searchTerm: "Tất cả du thuyền",
  selectedDeparturePoint: "Tất cả địa điểm",
  selectedPriceRange: "Tất cả mức giá",
  currentPage: 1,
  sortOption: "",
  selectedStars: [],
  selectedDurations: [],
  selectedServices: [], // Đổi từ selectedFeatures
  serviceShowCount: 5, // Đổi từ featureShowCount
  noResults: false,
  filteredYachts: [], // Thêm state để lưu kết quả lọc
  loading: false,     // Thêm state để theo dõi trạng thái tải
  error: null,       // Thêm state để lưu lỗi
};

const filtersReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload, currentPage: 1 };
    case "SET_STAR_FILTER":
      return {
        ...state,
        selectedStars: state.selectedStars.includes(action.payload)
          ? state.selectedStars.filter((star) => star !== action.payload)
          : [...state.selectedStars, action.payload],
        currentPage: 1,
      };
    case "SET_DURATION_FILTER":
      return {
        ...state,
        selectedDurations: state.selectedDurations.includes(action.payload)
          ? state.selectedDurations.filter((duration) => duration !== action.payload)
          : [...state.selectedDurations, action.payload],
        currentPage: 1,
      };
    case "SET_SERVICE_FILTER": // Đổi từ SET_FEATURE_FILTER
      return {
        ...state,
        selectedServices: state.selectedServices.includes(action.payload)
          ? state.selectedServices.filter((service) => service !== action.payload)
          : [...state.selectedServices, action.payload],
        currentPage: 1,
      };
    case "SET_DEPARTURE_POINT":
      return {
        ...state,
        selectedDeparturePoint: action.payload,
        currentPage: 1,
      };
    case "SET_PRICE_RANGE":
      return { ...state, selectedPriceRange: action.payload, currentPage: 1 };
    case "SET_SORT_OPTION":
      return { ...state, sortOption: action.payload, currentPage: 1 };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: Math.max(1, action.payload) };
    case "SET_SERVICE_SHOW_COUNT": // Đổi từ SET_FEATURE_SHOW_COUNT
      return { ...state, serviceShowCount: action.payload };
    case "SET_NO_RESULTS":
      return { ...state, noResults: action.payload };
    case "SET_FILTERED_YACHTS": // Thêm xử lý cho filteredYachts
      return { ...state, filteredYachts: action.payload };
    case "SET_LOADING": // Thêm xử lý cho loading
      return { ...state, loading: action.payload };
    case "SET_ERROR": // Thêm xử lý cho error
      return { ...state, error: action.payload };
      case "SET_SELECTED_STARS":
      return { ...state, selectedStars: action.payload };
    case "SET_SELECTED_DURATIONS":
      return { ...state, selectedDurations: action.payload };
    case "SET_SELECTED_SERVICES":
      return { ...state, selectedServices: action.payload };
    default:
      return state;
  }
};

export default filtersReducer;