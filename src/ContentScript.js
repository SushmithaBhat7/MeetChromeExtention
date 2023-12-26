// Initialize the MutationObserver
let observer = null;
let lastCaptions = ""; // Initialize the lastCaptions variable
let updatedString = "";
console.log("ContentScript.js is running");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.startObserving) {
    // Start observing when the message is received from the popup
    initializeMutationObserver();
  }
});

const initializeMutationObserver = () => {
  const captionCreditsSelector = ".a4cQT";
  const meetingTitleSelector = ".uBRSj";
  const targetNode = document.body; // You can specify a different target element
  const config = { childList: true, attributes: true, subtree: true };

  const sendCaptionsToPopup = (ccText) => {
    // Check if ccText is not just "You " before sending
    function deleteTwoWordsBeforeSubstring(inputString, targetSubstring) {
      // Define a regular expression pattern to match two words before the target substring
      const pattern = new RegExp(`\\w+\\s+\\w+\\s+${targetSubstring}`, "g");
      //\\w+: This part matches one or more word characters
      //\\s+: This part matches one or more whitespace characters.
      //'g': The 'g' flag stands for "global," and it's used in the regular expression to indicate that the search and replace should be performed globally throughout the input string. Without this flag, only the first match would be replaced.

      // Replace the matched pattern with an empty string
      const resultString = inputString.replace(pattern, "");

      return resultString;
    }
    if (ccText.trim() !== "You " && ccText !== lastCaptions) {
      lastCaptions = ccText;
      const targetSubstring = "Captions settings";
      if (ccText.includes(targetSubstring)) {
        updatedString = deleteTwoWordsBeforeSubstring(ccText, targetSubstring);
      }

      chrome.runtime.sendMessage({ captions: updatedString });
    }
  };

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
