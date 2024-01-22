import React, { useEffect, useRef, useState } from "react";
import CaptionsViewer from "./captionsViewer";
import generatePDF from "react-to-pdf";
import { options } from "./Constants/extentionContants";

const PopupComponentM = () => {
  const [message, setMessage] = useState("Loading...");
  // const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const targetRef = useRef();
  const [currentUrl, setCurrentUrl] = useState("");

  const [viewCapture, setViewCapture] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  // const [dataFound, setDataFound] = useState(false);
  // const [showDataArray, setShowDataArray] = useState(false);

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
    chrome.runtime.onMessage.addListener(function (
      message,
      sender,
      sendResponse
    ) {
      // Check if the message contains the array
      if (message && message.data) {
        var receivedArray = message.data;
        // Do something with the received array
        console.log(receivedArray);
        setDataArray(receivedArray);
        // if (receivedArray.length > 0) {
        //   setDataFound(true);
        // }
      }
    });
  });

  const handleButtonClickViewCapture = () => {
    setIsVisible(!isVisible);
    setViewCapture(!viewCapture);
  };

  sendMessageToMainPage();

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`popup ${isMinimized ? "minimized" : ""}`}>
      {!isMinimized && (
        <div className="mainHeadding">
          <p className="firstHeadding">MeetCaptionCollector</p>
          <p className="subHeadding"> for Chrome</p>
          <hr />
        </div>
      )}

      {!isMinimized && isVisible && (
        <div className="mainDiscription glassEffect">
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
      {!isMinimized && (
        <div>
          {viewCapture ? (
            <div>
              <div className="mainViewCapture">
                <button
                  onClick={handleButtonClickViewCapture}
                  className="downloadPDFBtnStyle"
                >
                  Close View Capture
                </button>
                <button
                  onClick={() =>
                    generatePDF(targetRef, options, { filename: "page.pdf" })
                  }
                  className="downloadPDFBtnStyle"
                >
                  {/* <img src="./assets/pdf_download.png" alt="Icon" id="iconImage"></img> */}
                  <img
                    src="https://i.ibb.co/3yL1gmz/pdf-download.png"
                    alt="pdf-download"
                    id="iconImage"
                  ></img>
                  Download
                </button>
              </div>

              <div ref={targetRef} className="subViewCapture">
                <CaptionsViewer captions={dataArray} />
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
      )}
      <button onClick={handleToggleMinimize} className="toggleMinimizeBtn">
        {isMinimized ? "Restore" : "Minimize"}
      </button>
    </div>
  );
};

export default PopupComponentM;
