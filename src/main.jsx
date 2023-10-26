// import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import PopupComponent from "./popup.jsx";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <>
//     <PopupComponent />
//   </>
// );

const root = document.createElement("div");
root.className = "container";

document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <>
    <PopupComponent />
  </>
);
