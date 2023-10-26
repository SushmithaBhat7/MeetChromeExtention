import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import PopupComponentMain from "./popupMain";

const root = document.createElement("div");
root.id = "crx-root";
document.body.appendChild(root);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PopupComponentMain />
  </React.StrictMode>
);

// const root = document.createElement("div");
// root.className = "container";

// document.body.appendChild(root);

// ReactDOM.createRoot(root).render(
//   <>
//     <PopupComponentMain />
//   </>
// );
