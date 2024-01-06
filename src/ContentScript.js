// Initialize the MutationObserver
let observer = null;
let lastCaptions = "";
let lastUserName = "";
let updatedString = "";
let dataObjc = {};
console.log("ContentScript.js is running");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.startObserving) {
    // Start observing when the message is received from the popup
    initializeMutationObserver();
  }
});

const initializeMutationObserver = () => {
  const captionCreditsSelector = ".iTTPOb.VbkSUe";
  const userNameSelector = ".zs7s8d.jxFHg";
  // const meetingTitleSelector = ".uBRSj";
  const targetNode = document.body; // You can specify a different target element
  const config = { childList: true, attributes: true, subtree: true };

  const sendCaptionsToPopup = (ccText, userName) => {
    if (ccText !== lastCaptions) {
      lastCaptions = ccText;
      if (userName !== lastUserName) {
        lastUserName = userName;
        const updatedCaption = `${lastUserName} : ${lastCaptions}`;
        // if (!dataObjc.hasOwnProperty(lastUserName)) {
        //   dataObjc[lastUserName] = lastCaptions;
        // } else {
        //   dataObjc.lastUserName = `${dataObjc.lastUserName}${lastCaptions}`;
        // }
        // console.log("dataObjc :", dataObjc);

        chrome.runtime.sendMessage({ captions: updatedCaption });
      } else {
        // dataObjc.lastUserName = `${dataObjc.lastUserName}${lastCaptions}`;
        // chrome.runtime.sendMessage({ captions: dataObjc.lastUserName });
        chrome.runtime.sendMessage({ captions: lastCaptions });
      }
    }
  };

  const mutationCallback = (mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === "childList" || mutation.type === "attributes") {
        const captionCreditsElement = document.querySelector(
          captionCreditsSelector
        );
        const userNameElement = document.querySelector(userNameSelector);

        if (captionCreditsElement) {
          // Element found, capture captions or perform actions
          const userName = userNameElement.textContent;
          const ccText = captionCreditsElement.innerText;
          console.log("Caption Credits:", ccText);

          // You can send the captured captions back to the popup or perform other actions here
          sendCaptionsToPopup(ccText, userName);
        }
      }
    });
  };

  // Create the MutationObserver
  observer = new MutationObserver(mutationCallback);
  observer.observe(targetNode, config);
};
