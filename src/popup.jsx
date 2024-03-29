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
  const [isMinimized, setIsMinimized] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const [dataFound, setDataFound] = useState(false);
  const [showDataArray, setShowDataArray] = useState(false);

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
        if (receivedArray.length > 0) {
          setDataFound(true);
        }
      }
    });
  });

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
  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  const handleDataArray = () => {
    setShowDataArray(!showDataArray);
  };

  const base64Image =
    "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";

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
      {/* <button onClick={handleDataArray}>View DataArray</button> */}
      {/* {showDataArray &&
        dataFound &&
        dataArray.map((item, index) => {
          return (
            <ul key={index}>
              <li>{item}</li>
            </ul>
          );
        })} */}
    </div>
  );
};

export default PopupComponentM;
