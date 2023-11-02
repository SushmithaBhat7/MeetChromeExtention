import React, { useEffect, useState } from "react";
import CaptionsViewer from "./captionsViewer";

const PopupComponentM = () => {
  const [message, setMessage] = useState("Loading...");
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [isCaptureActive, setIsCaptureActive] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [captions, setCaptions] = useState([]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;

      if (url && url.startsWith("https://meet.google.com/")) {
        setMessage("Yayy, you got to the right page");
        setIsMeetingActive(true);
      } else {
        setMessage("Wrong page");
        setIsMeetingActive(false);
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

  const toggleMeeting = () => {
    setIsMeetingActive((prev) => !prev);
    setIsCaptureActive(!isMeetingActive);
    // if (!isCaptureActive) {
    //   // Trigger the MutationObserver setup on the main page
    //   console.log("Inside isCaptureActive");
    //   sendMessageToMainPage();
    // }
  };
  sendMessageToMainPage();

  return (
    <div>
      <h1>Popup</h1>
      <p>{message}</p>
      <p>{isMeetingActive ? "Meeting Active" : "Not Active"}</p>
      {isMeetingActive ? (
        <button onClick={toggleMeeting}>Start Capture</button>
      ) : (
        currentUrl &&
        currentUrl.startsWith("https://meet.google.com/") && (
          <button onClick={toggleMeeting}>Stop Capture</button>
        )
      )}
      <div>
        <h2>Captions Viewer</h2>
        {captions.map((caption, index) => (
          <div key={index}>{caption}</div>
        ))}
      </div>
    </div>
  );
};

export default PopupComponentM;
