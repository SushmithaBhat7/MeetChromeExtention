import myExtensionStyles from "./index.css";

if (!document.getElementById("myExtensionStylesheet")) {
  const styleElement = document.createElement("style");
  styleElement.id = "myExtensionStylesheet";
  styleElement.innerHTML = myExtensionStyles;
  document.head.appendChild(styleElement);
}
// Initialize the MutationObserver
let observer = null;
let lastCaptions = "";
let lastUserName = "";
let updatedString = "";
let dataObjc = {};
let isObserving = false;
let debounceTimer;
const optionSelector = ".R5ccN";
const combinedCaptions = [];
var myButton = document.createElement("button");
console.log("ContentScript.js is running");

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
  if (!isObserving) {
    observer = new MutationObserver(mutationCallback);
    observer.observe(targetNode, config);
    isObserving = isObserving === false ? true : false;
    myButton.style.backgroundColor = "#fff";
    myButton.style.color = "#181818";
  } else {
    isObserving = isObserving === false ? true : false;
    observer.disconnect();
    myButton.style.backgroundColor = "rgb(60, 64, 67)";
    myButton.style.color = "#fff";
  }
};

// content.js

function addButtonToSpecificDiv(divClassName) {
  // Create a button element
  var ccCaptureComponent = document.createElement("div");
  ccCaptureComponent.id = "ccCaptureComponent";

  myButton.textContent = "CCC";
  myButton.id = "myExtensionButton";

  ccCaptureComponent.appendChild(myButton);

  let tooltipSpan = document.createElement("span");
  tooltipSpan.textContent = "Turn on capture captions"; // Set the tooltip content
  tooltipSpan.id = "myExtensionButtonOnHover";

  // Function to add the button to the specific div
  function addBtnToDiv() {
    var specificDiv = document.querySelector("." + divClassName);

    if (specificDiv && !specificDiv.contains(myButton)) {
      specificDiv.insertBefore(myButton, specificDiv.firstChild);
      myButton.appendChild(tooltipSpan);

      myButton.addEventListener("click", initializeMutationObserverContent);
    }
  }

  var observer = new MutationObserver(addBtnToDiv);
  observer.observe(document.body, { childList: true, subtree: true });
}

// Call the function with the class name of the div
addButtonToSpecificDiv("R5ccN");
