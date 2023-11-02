import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import PopupComponent from "./popup.jsx";
import PopupComponentM from "./popupM";

const root = document.createElement("div");
root.id = "crx-root";
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <PopupComponentM />
  </React.StrictMode>
);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <>
//     <PopupComponentM />
//   </>
// );
