import React, { useEffect, useState } from "react";
import CaptionsViewer from "./captionsViewer";

const PopupComponentM = () => {
  const [message, setMessage] = useState("Loading...");

  const [currentUrl, setCurrentUrl] = useState("");
  const [captions, setCaptions] = useState([]);
  const [viewCapture, setViewCapture] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;

      if (url && url.startsWith("https://meet.google.com/")) {
        setMessage("You are in right page");
      } else {
        setMessage("Wrong page");
      }

      // Set the current URL in the state
      setCurrentUrl(url);
    });
  }, []);
  const sendMessageToMainPage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      console.log("activeTab.id :", activeTab.id);
      chrome.tabs.sendMessage(activeTab.id, { startObserving: true });
    });
  };
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.captions) {
        // When the content script sends captions, update the state
        setCaptions((prevCaptions) => [...prevCaptions, message.captions]);
      }
    });
  }, []);

  const handleButtonClickViewCapture = () => {
    setViewCapture(!viewCapture);
  };

  sendMessageToMainPage();

  return (
    <div className="popup">
      <h3>{message}</h3>

      <div>
        {viewCapture ? (
          <div>
            <button onClick={handleButtonClickViewCapture}>
              Close View Capture
            </button>
            <CaptionsViewer captions={captions} />
          </div>
        ) : (
          <button onClick={handleButtonClickViewCapture}>View Capture</button>
        )}
      </div>
    </div>
  );
};

export default PopupComponentM;
