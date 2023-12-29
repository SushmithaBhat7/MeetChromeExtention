import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
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

  const handleDownloadPDF = () => {
    // Create a new jsPDF instance
    const pdf = new jsPDF();

    const combinedCaptions = [];
    for (let caption of captions) {
      caption = caption.replace(/\n/g, ""); // Remove line breaks before adding to lastCaption

      if (combinedCaptions.length === 0) {
        combinedCaptions.push(caption);
      } else {
        const lastCaption = combinedCaptions[
          combinedCaptions.length - 1
        ].replace(/\n/g, "");
        if (
          caption.startsWith(lastCaption) ||
          lastCaption.startsWith(caption) ||
          caption.toLowerCase().slice(0, -1) ===
            lastCaption.toLowerCase().slice(0, -1)
        ) {
          // If the new caption starts with the previous one or vice versa, combine them.
          combinedCaptions[combinedCaptions.length - 1] = caption;
        } else {
          // If not, push the new caption to the array.
          combinedCaptions.push(caption);
        }
      }
    }

    pdf.addFileToVFS("./assets/hindi.TTF", "HindiFont");
    pdf.addFont("./assets/hindi.TTF", "HindiFont", "normal");

    const addMultilineText = (textArray, font, x, y, maxWidth) => {
      pdf.setFont(font);
      pdf.setFontType("normal");
      textArray.forEach((text, index) => {
        // Split the text into lines based on the maxWidth
        const lines = pdf.splitTextToSize(text, maxWidth);

        // Add each line to the PDF
        lines.forEach((line, lineIndex) => {
          pdf.text(line, x, y + index * 10 + lineIndex * 10); // Adjust the line height as needed
        });
      });
    };

    // Add multiline text to the PDF
    addMultilineText(combinedCaptions, "HindiFont", 10, 10, 180); // Adjust the maxWidth as needed

    // Save the PDF as a file
    pdf.save("multiline_text.pdf");
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
        <button onClick={handleDownloadPDF}>PDF Download</button>
      </div>
    </div>
  );
};

export default PopupComponentM;
