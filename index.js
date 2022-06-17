import React from "react";
import ReactDOM from "react-dom";
import "./src/index.css";
import App from "./src/App";
import populateDB from './src/components/common/populateDB'
populateDB()
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
