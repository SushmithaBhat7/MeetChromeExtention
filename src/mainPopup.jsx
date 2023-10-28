import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import PopupComponentMain from "./popupMain";

const root = document.createElement("div");
root.id = "crx-root";
document.body.appendChild(root);
// Function to check the URL and render the Popup component if the condition is met
function checkURLAndRenderPopup() {
  const currentURL = window.location.href;
  if (currentURL === "https://meet.google.com/*") {
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <PopupComponentMain />
      </React.StrictMode>
    );
  }
}

// Call the function when the extension is loaded or when the URL changes
checkURLAndRenderPopup();
