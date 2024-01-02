import React, { useEffect, useRef, useState } from "react";
import CaptionsViewer from "./captionsViewer";
import generatePDF, { Resolution, Margin } from "react-to-pdf";

const PopupComponentM = () => {
  const [message, setMessage] = useState("Loading...");
  // const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const targetRef = useRef();
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

  const options = {
    // default is `save`
    method: "open",
    resolution: Resolution.HIGH,
    page: {
      // margin is in MM, default is Margin.NONE = 0
      margin: Margin.SMALL,
      //letter
      format: "A4",
      //landscape
      orientation: "portrait",
    },
    canvas: {
      // default is 'image/jpeg' for better size performance
      mimeType: "image/png",
      qualityRatio: 1,
    },
    overrides: {
      // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
      pdf: {
        compress: true,
      },
      // see https://html2canvas.hertzen.com/configuration for more options
      canvas: {
        useCORS: true,
      },
    },
  };

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
      <div
        style={{
          margin: "10px", // Set margin for the entire page
          border: "10px solid transparent", // Transparent border to create space
          width: "500px",
        }}
      >
        <button
          onClick={() =>
            generatePDF(targetRef, options, { filename: "page.pdf" })
          }
        >
          Download PDF
        </button>

        <div
          ref={targetRef}
          style={{ padding: "10px", border: "1px solid #000" }}
        >
          <CaptionsViewer captions={captions} />
        </div>
      </div>
    </div>
  );
};

export default PopupComponentM;
