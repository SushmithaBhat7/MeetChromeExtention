import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import PopupComponentMain from "./popupMain";

const root = document.createElement("div");
root.className = "container";
document.body.appendChild(root);
ReactDOM.createRoot(root).render(
  /*#__PURE__*/ React.createElement(
    React.Fragment,
    null,
    /*#__PURE__*/ React.createElement(PopupComponentMain, null)
  )
);
