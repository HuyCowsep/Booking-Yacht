import React from "react";
import { createRoot } from "react-dom/client"; // 👈 React 18 API nè
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import store from "./redux/store";

// Thay thế render truyền thống bằng createRoot
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
