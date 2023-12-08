// Initialize the MutationObserver
let observer = null;
let lastCaptions = ""; // Initialize the lastCaptions variable
console.log("ContentScript.js is running");

let isObserving = false; // Track capturing status

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("message.startObserving :", message.startObserving);
  if (message.startObserving) {
    // Start observing when the message is received from the popup
    console.log("initializeMutationObserver");
    isObserving = true;
    initializeMutationObserver();
  } else if (message.stopObserving) {
    // Stop observing when the message is received from the popup
    console.log("disconnectObserver");
    isObserving = false;
    disconnectObserver();
  }
});
const sendCaptionsToPopup = (ccText) => {
  if (isObserving && ccText.trim() !== "You " && ccText !== lastCaptions) {
    lastCaptions = ccText; // Update the lastCaptions variable
    console.log("lastCaptions :", lastCaptions);

    // Send the captured captions to the popup
    chrome.runtime.sendMessage({ captions: ccText });
  }
};

const initializeMutationObserver = () => {
  const captionCreditsSelector = ".iOzk7";
  const targetNode = document.body; // You can specify a different target element
  const config = { childList: true, attributes: true, subtree: true };

  const mutationCallback = (mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === "childList" || mutation.type === "attributes") {
        const captionCreditsElement = document.querySelector(
          captionCreditsSelector
        );
        console.log("Inside forEach");
        console.log("captionCreditsElement : ", captionCreditsElement);
        if (captionCreditsElement) {
          // Element found, capture captions or perform actions
          const ccText = captionCreditsElement.innerText;
          console.log("Caption Credits:", ccText);
          // Store ccText in local storage
          //   localStorage.setItem("ccText", JSON.stringify(ccText));

          // You can send the captured captions back to the popup or perform other actions here
          // Send the captured captions to the popup if it's not just "You "
          sendCaptionsToPopup(ccText);
        }
      }
    });
  };

  // Create the MutationObserver
  observer = new MutationObserver(mutationCallback);
  observer.observe(targetNode, config);
};

const disconnectObserver = () => {
  if (observer) {
    observer.disconnect();
  }
};
