// popup/popup.jsx
import React, { useEffect, useState } from "react";

const PopupComponent = () => {
  const [message, setMessage] = useState("Loading...");
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

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

  const toggleMeeting = () => {
    // Toggle the meeting status
    setIsMeetingActive((prev) => !prev);

    // Perform actions based on the meeting status
    if (isMeetingActive) {
      // Stop the meeting
      // Add your code here to stop the meeting
    } else {
      // Start the meeting
      // Add your code here to start the meeting
    }
  };

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
    </div>
  );
};

export default PopupComponent;
