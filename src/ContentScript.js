// Initialize the MutationObserver
let observer = null;
let lastCaptions = "";
let lastUserName = "";
let updatedString = "";
let dataObjc = {};
let debounceTimer;
const optionSelector = ".R5ccN";
const combinedCaptions = [];
console.log("ContentScript.js is running");

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.startObserving) {
//     // Start observing when the message is received from the popup
//     initializeMutationObserver();
//   }
// });

const initializeMutationObserver = () => {
  const captionCreditsSelector = ".iTTPOb.VbkSUe";
  const userNameSelector = ".zs7s8d.jxFHg";

  // const meetingTitleSelector = ".uBRSj";
  const targetNode = document.body; // You can specify a different target element
  const config = { childList: true, attributes: true, subtree: true };

  const sendCaptionsToPopup = (ccText, userName) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (ccText !== lastCaptions) {
        lastCaptions = ccText;
        if (userName !== lastUserName) {
          lastUserName = userName;
          const updatedCaption = `${lastUserName} : ${lastCaptions}`;
          chrome.runtime.sendMessage({ captions: updatedCaption });
        } else {
          chrome.runtime.sendMessage({ captions: lastCaptions });
        }
      }
    }, 400);
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

const initializeMutationObserverContent = () => {
  const captionCreditsSelector = ".iTTPOb.VbkSUe";
  const userNameSelector = ".zs7s8d.jxFHg";

  // const meetingTitleSelector = ".uBRSj";
  const targetNode = document.body; // You can specify a different target element
  const config = { childList: true, attributes: true, subtree: true };

  const sendCaptionsToPopup = (ccText, userName) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (ccText !== lastCaptions) {
        lastCaptions = ccText;

        const updatedCaption = `${userName} : ${lastCaptions}`;

        saveCaptions(updatedCaption);
      }
    }, 400);
  };

  const saveCaptions = (captions) => {
    if (combinedCaptions.length === 0) {
      combinedCaptions.push(captions);
    } else {
      const lastCaption = combinedCaptions[combinedCaptions.length - 1].replace(
        /\n/g,
        ""
      );

      console.log("captions :", captions);
      console.log("lastCaption :", lastCaption);
      if (
        captions.startsWith(lastCaption) ||
        lastCaption.startsWith(captions) ||
        (typeof captions === "string"
          ? captions.toLowerCase().slice(0, -1)
          : "") ===
          (typeof lastCaption === "string"
            ? lastCaption.toLowerCase().slice(0, -1)
            : "") ||
        (captions.length > 60 &&
          // lastCaption.toLowerCase.includes(caption.toLowerCase.slice(0, 40)))

          (typeof lastCaption === "string"
            ? lastCaption
                .toLowerCase()
                .includes(
                  typeof captions === "string"
                    ? captions.toLowerCase().slice(0, 40)
                    : ""
                )
            : ""))
      ) {
        console.log("Update Test");
        // If the new caption starts with the previous one or vice versa, combine them.
        combinedCaptions[combinedCaptions.length - 1] = captions;
      } else {
        console.log(" push Try ");
        // If not, push the new caption to the array.
        combinedCaptions.push(captions);
      }
    }

    console.log("combinedCaptions : ", combinedCaptions);
    chrome.runtime.sendMessage({ data: combinedCaptions });
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

// content.js

function addButtonToSpecificDiv(divClassName) {
  // Create a button element
  var myButton = document.createElement("button");
  myButton.textContent = "Me";
  myButton.id = "myExtensionButton";

  // Function to add the button to the specific div
  function addBtnToDiv() {
    // Find the specific div element using its class
    var specificDiv = document.querySelector("." + divClassName);

    // Check if the div exists and the button is not already added
    if (specificDiv && !specificDiv.contains(myButton)) {
      // Append the button to the specific div
      // specificDiv.appendChild(myButton);
      specificDiv.insertBefore(myButton, specificDiv.firstChild);

      // Add an event listener to the button
      myButton.addEventListener("click", initializeMutationObserverContent);
    }
  }

  // Use MutationObserver to observe changes in the DOM
  var observer = new MutationObserver(addBtnToDiv);

  // Configure the observer to look for additions of child elements
  observer.observe(document.body, { childList: true, subtree: true });
}

// Call the function with the class name of the div
addButtonToSpecificDiv("R5ccN");
