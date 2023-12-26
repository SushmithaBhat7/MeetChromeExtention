// Initialize the MutationObserver
let observer = null;
let lastCaptions = {}; // Initialize the lastCaptions variable
console.log("ContentScript.js is running");
window.messages = [];
// background.js

let observerInitialized = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.startObserving && !observerInitialized) {
    console.log("Hey Boy", observerInitialized);
    observerInitialized = true;
    initializeMutationObserver();
  }
});

const initializeMutationObserver = () => {
  const targetNode = document.querySelector(".iOzk7");
  const config = {
    childList: true,
    subtree: true,
    attribute: true,
  };

  const sendCaptionsToPopup = (ccText) => {
    const ccTextArray = Object.entries(ccText).map(([name, message]) => {
      const result = { name, message };
      window.messages.push(result);
      return result;
    });

    console.log("ccTextArray :", ccTextArray);
    if (ccTextArray.length > 0) {
      chrome.runtime.sendMessage({ captions: ccTextArray });
    }
  };

  const mutationCallback = (mutationList) => {
    mutationList.forEach((mutation) => {
      if (mutation.addedNodes) {
        const captionText =
          document.querySelector(".iTTPOb.VbkSUe").textContent;
        console.log("captionText :", captionText);
      }
      // const nodes = Array.from(mutation.addedNodes);

      //console.log("mutation :", mutation);
      // console.log("nodes[0] : ", nodes[0]);

      // if (nodes[0] && nodes[0].tagName.toLowerCase() === "span") {
      //   console.log(nodes[0].textContent);
      // }
      //console.log("nodes : ", nodes);
      // console.log("nodes[0].tagName : ", nodes[0].tagName);
      // console.log("nodes.length : ", nodes.length);
      // nodes.forEach((a) => {
      //   console.log("a.tagName :", a.tagName);
      // });
    });

    // for (const mutation of mutationList) {
    //   console.log("mutation :", mutation);
    //   //console.log("mutation.addedNodes :", mutation.addedNodes);
    //   // mutation.addedNodes[0].classList.contains("TBMuR"),
    //   // mutation.addedNodes[0].classList.contains("TBMuR"),

    //   // mutation.addedNodes[0].classList.contains("iTTPOb"),
    //   // mutation.removeNodes[0].classList.contains("TBMuR"),
    //   // mutation.removeNodes[0].classList.contains("iTTPOb")

    //   // console.log("mutation.addedNodes[0] :", mutation.addedNodes[0]);
    //   // console.log("mutation.addedNodes :", mutation.addedNodes);
    //   // console.log("mutation.addedNodes.target :", mutation.addedNodes.target);
    //   console.log("Old Value:", mutation.oldValue);
    //   const userWrapperElement = document.querySelectorAll(".iOzk7 > div");
    //   let ccText = {};
    //   // console.log("1234Hiii");

    //   userWrapperElement.forEach((element) => {
    //     const userElement = element.querySelector(".zs7s8d.jxFHg").textContent;
    //     const captionText = element.querySelector(".iTTPOb.VbkSUe").textContent;
    //     const result2 = { ...ccText, [userElement]: captionText };
    //     ccText = result2;
    //   });
    //   if (Object.keys(ccText).length > 0) {
    //     console.log("ccTextwwe :", ccText);
    //   }
    // }

    // // Compare with the lastCaptions to avoid processing duplicates
    // if (JSON.stringify(ccText) !== JSON.stringify(lastCaptions)) {
    //   // Update lastCaptions
    //   lastCaptions = ccText;

    //   // You can send the captured captions back to the popup or perform other actions here
    //   // Send the captured captions to the popup if it's not just "You "
    //   sendCaptionsToPopup(ccText);
    // }
  };

  // Create the MutationObserver
  console.log("$$Hello this is a test sentence");
  observer = new MutationObserver(mutationCallback);
  observer.observe(targetNode, config);
};
