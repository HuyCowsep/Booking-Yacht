import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import {
  yachtReducer,
  imageReducer,
  uiReducer,
  bookingReducer,
  reviewsReducer,
  filtersReducer,
  consultationReducer,
  authReducer,
  reviewFormReducer,
  servicerReducer,
} from "./reducers";

const rootReducer = combineReducers({
  yacht: yachtReducer,
  images: imageReducer,
  ui: uiReducer,
  booking: bookingReducer,
  reviews: reviewsReducer,
  filters: filtersReducer,
  consultation: consultationReducer,
  reviewForm: reviewFormReducer,
  auth: authReducer,
  services: servicerReducer,
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
//LOG STATE ban đầu để dễ dàng kiểm tra, sau khi xong thì có thể xóa đi
console.log("Redux Store initialized:", store.getState());

export default store;
