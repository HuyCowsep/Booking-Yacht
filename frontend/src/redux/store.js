import { createStore, combineReducers } from "redux";
import filtersReducer from "./reducers";

const rootReducer = combineReducers({
  filters: filtersReducer,
});

const store = createStore(rootReducer);

// Log state ban đầu để dễ kiểm tra (có thể bỏ sau khi debug xong)
console.log("Initial Redux State:", store.getState());

export default store;