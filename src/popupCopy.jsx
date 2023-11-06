import { useEffect, useState } from "react";

const PopupComponent = () => {
  const [message, setMessage] = useState("Loading...");
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [captions, setCaptions] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false); // State to track capturing status

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

  const startCapturing = () => {
    setIsMeetingActive((prev) => !prev);
    console.log("startCapturing");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      console.log("activeTab.id :", activeTab.id);
      chrome.tabs.sendMessage(activeTab.id, { startObserving: true });
    });
    setIsCapturing(true);
  };

  const stopCapturing = () => {
    setIsMeetingActive((prev) => !prev);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      console.log("activeTab.id :", activeTab.id);
      chrome.tabs.sendMessage(activeTab.id, { startObserving: true });
    });
    setIsCapturing(false);
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.captions) {
        setCaptions(message.captions);
      }
    });
  }, []);

  const toggleMeeting = () => {
    setIsMeetingActive((prev) => !prev);
  };
  // sendMessageToMainPage();

  return (
    <div>
      <h1>Popup</h1>
      <p>{message}</p>
      <p>{isMeetingActive ? "Meeting Active" : "Not Active"}</p>
      {isMeetingActive ? (
        <button onClick={startCapturing} disabled={isCapturing}>
          Start Capture
        </button>
      ) : (
        currentUrl &&
        currentUrl.startsWith("https://meet.google.com/") && (
          <button onClick={stopCapturing} disabled={!isCapturing}>
            Stop Capture
          </button>
        )
      )}
      <div>
        <h2>Captions Viewer</h2>
        {console.log("captions :", captions)}
        {captions.map((caption, index) => (
          <div key={index}>{caption}</div>
        ))}
      </div>
    </div>
  );
};

export default PopupComponent;
