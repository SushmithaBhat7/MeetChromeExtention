import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import PopupComponent from "./popup";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

const root = document.createElement("div");
root.id = "crx-root";
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <PopupComponent />
  </React.StrictMode>
);
