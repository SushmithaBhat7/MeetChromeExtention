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
  const [isVisible, setIsVisible] = useState(true);

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
    setIsVisible(!isVisible);
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
      <div className="mainHeadding">
        <p className="firstHeadding">MeetCaptionCollector</p>
        <p className="subHeadding"> for Chrome</p>
      </div>

      <hr />
      {isVisible && (
        <div className="mainDiscription">
          <div className="subTopDiscription">
            Capture and Save Google Meet Captions
          </div>
          <ul className="subDiscription">
            <li className="subListDiscription">
              Enhance your Google Meet experience by collecting and storing live
              captions seamlessly.
            </li>
            <li className="subListDiscription">
              MeetCaptionCollector ensures you have a log of discussions at your
              fingertips.
            </li>
          </ul>
        </div>
      )}
      <div>
        {viewCapture ? (
          <div>
            <div className="mainViewCapture">
              <button
                onClick={handleButtonClickViewCapture}
                className="defaultBtnStyle"
              >
                Close View Capture
              </button>
              <button
                onClick={() =>
                  generatePDF(targetRef, options, { filename: "page.pdf" })
                }
                className="downloadPDFBtnStyle"
              >
                Download PDF
              </button>
            </div>

            <div ref={targetRef} className="subViewCapture">
              <CaptionsViewer captions={captions} />
            </div>
          </div>
        ) : (
          <div className="viewCaptureBtnDiv">
            <button
              onClick={handleButtonClickViewCapture}
              className="defaultBtnStyle pulse"
            >
              View Capture
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupComponentM;
