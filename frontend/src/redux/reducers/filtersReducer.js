// === FILTERS REDUCER ===
const filtersInitialState = {
  searchTerm: "Tất cả du thuyền",
  selectedDeparturePoint: "Tất cả địa điểm",
  selectedPriceRange: "Tất cả mức giá",
  currentPage: 1,
  sortOption: "",
  selectedStars: [],
  selectedDurations: [],
  selectedServices: [],
  serviceShowCount: 5,
  noResults: false,
  filteredYachts: [],
  loading: false,
  error: null,
};

const filtersReducer = (state = filtersInitialState, action) => {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload, currentPage: 1 };
    case "SET_STAR_FILTER":
      return {
        ...state,
        currentPage: 1,
        selectedStars: state.selectedStars.includes(action.payload)
          ? state.selectedStars.filter((star) => star !== action.payload)
          : [...state.selectedStars, action.payload],
      };
    case "SET_DURATION_FILTER":
      return {
        ...state,
        currentPage: 1,
        selectedDurations: state.selectedDurations.includes(action.payload)
          ? state.selectedDurations.filter(
              (duration) => duration !== action.payload
            )
          : [...state.selectedDurations, action.payload],
      };
    case "SET_SERVICE_FILTER":
      return {
        ...state,
        currentPage: 1,
        selectedServices: state.selectedServices.includes(action.payload)
          ? state.selectedServices.filter(
              (service) => service !== action.payload
            )
          : [...state.selectedServices, action.payload],
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
    case "SET_SERVICE_SHOW_COUNT":
      return { ...state, serviceShowCount: action.payload };
    case "SET_NO_RESULTS":
      return { ...state, noResults: action.payload };
    case "SET_FILTERED_YACHTS":
      return { ...state, filteredYachts: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
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
