import { combineReducers } from "redux";
import {
  authReducer,
  bookingReducer,
  filtersReducer,
  imageReducer,
  invoiceReducer,
  paymentReducer,
  reviewFormReducer,
  reviewsReducer,
  servicerReducer,
  uiReducer,
  yachtReducer,
  userReducer,
  adminReducer,
} from "./reducers";

const rootReducer = combineReducers({
  yacht: yachtReducer,
  services: servicerReducer,
  images: imageReducer,
  ui: uiReducer,
  booking: bookingReducer,
  reviews: reviewsReducer,
  reviewForm: reviewFormReducer,
  auth: authReducer,
  filters: filtersReducer,
  payment: paymentReducer,
  invoice: invoiceReducer,
  account: userReducer,
  admin: adminReducer,
});

export default rootReducer;

