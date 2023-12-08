import React, { useEffect, useState } from "react";
import CaptionsViewer from "./captionsViewer";

const PopupComponentM = () => {
  const [message, setMessage] = useState("Loading...");
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [isCaptureActive, setIsCaptureActive] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [captions, setCaptions] = useState([]);
  const [ccText, setCcText] = useState("");

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
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.captions) {
        // When the content script sends captions, update the state
        setCaptions((prevCaptions) => [...prevCaptions, message.captions]);
      }
    });
  }, []);

  //   const handleButtonClick = () => {
  //     // Retrieve the ccText value from local storage
  //     const storedCcText = JSON.parse(localStorage.getItem("ccText"));

  //     if (storedCcText) {
  //       // Update the state with the retrieved ccText
  //       setCcText(storedCcText);
  //     } else {
  //       // Handle the case where ccText is not found in local storage
  //       setCcText("No caption text found in local storage.");
  //     }
  //   };

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
      {/* <div>
        <button onClick={handleButtonClick}>Display Caption Text</button>
        <div>
          <p>Stored Caption Text:</p>
          <p>{ccText}</p>
        </div>
      </div> */}
      <div>
        <CaptionsViewer captions={captions} />
      </div>
    </div>
  );
};

export default PopupComponentM;
