chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
  });
  console.log("Hello");
});

chrome.runtime.onInstalled.addListener(async () => {
  // Initialize your extension or perform setup tasks here
  // This code runs when the extension is installed or updated

  // You can also send a message to your content script or popup if needed
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    console.log("activeTab");
    if (activeTab) {
      chrome.tabs.sendMessage(activeTab.id, { extensionInstalled: true });
    }
  });
});
