// Initialize the MutationObserver
let observer = null;

console.log("ContentScript.js is running");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("message", message);
  if (message.startObserving) {
    // Start observing when the message is received from the popup
    initializeMutationObserver();
  }
});

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

          // You can send the captured captions back to the popup or perform other actions here
        }
      }
    });
  };

  // Create the MutationObserver
  observer = new MutationObserver(mutationCallback);
  observer.observe(targetNode, config);
};
