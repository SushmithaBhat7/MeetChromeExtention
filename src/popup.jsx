/* eslint-disable no-inner-declarations */
import React, { useEffect, useState } from "react";
import CaptionsViewer from "./captionsViewer";

const PopupComponent = () => {
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

  const captionCreditsSelector = ".a4cQT";
  function waitUntil(predicate, success, error) {
    var int = setInterval(() => {
      if (predicate()) {
        clearInterval(int);
        int = null;
        success();
      }
    }, 33);
    setTimeout(() => {
      if (int !== null) {
        clearInterval(int);
        if (typeof error === "function") {
          error();
        }
      }
    }, 25000);
  }

  const handleMutation = (mutationsList) => {
    console.log("Inside handleMutation function");
    console.log("mutationsList :", mutationsList);
    mutationsList.forEach((mutation) => {
      if (mutation.type === "childList") {
        setTimeout(() => {
          const captionCreditsElement = document.querySelector(
            captionCreditsSelector
          );
          console.log("Check1");
          const caption = document.querySelectorAll(".iOzk7");
          console.log("$$caption", caption);
          waitUntil(
            () => document.querySelectorAll(".iOzk7").length > 0,
            () => {
              const caption = document.querySelectorAll(".iOzk7");
              console.log("$$caption", caption);
            }
          );
          console.log("Inside forEach");
          console.log("captionCreditsElement", captionCreditsElement);

          if (
            captionCreditsElement &&
            captionCreditsElement.classList.contains("a4cQT")
          ) {
            const ccText = captionCreditsElement.innerText;
            console.log("Caption Credits:", ccText);

            // Store the captions and perform other actions as needed
            chrome.storage.local.get("captions", (data) => {
              const storedCaptions = data.captions || [];
              console.log(storedCaptions);
              storedCaptions.push(ccText);
              chrome.storage.local.set({ captions: storedCaptions });
            });
          }
        }, 3000);
      }
    });
  };

  useEffect(() => {
    if (!isCaptureActive) {
      // Start observing when not in a meeting
      console.log("Inside isCapture");
      const observer = new MutationObserver(handleMutation);
      const targetNode = document.body; // You can specify the target element
      const config = { childList: true, subtree: true };
      observer.observe(targetNode, config);

      // Clean up the observer when meeting becomes active
      return () => observer.disconnect();
    }
  }, [isCaptureActive]);

  const toggleMeeting = () => {
    setIsMeetingActive((prev) => !prev);
    if (!isMeetingActive) {
      setIsCaptureActive(true);
    } else {
      setIsCaptureActive(false);
    }
  };

  // console.log("captions : ", { captions });

  (() => {})();

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

export default PopupComponent;
