chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      // Wait for the DOM to be fully loaded
      document.addEventListener("DOMContentLoaded", () => {
        // Create the button here
        const newButton = document.createElement("button");
        newButton.textContent = "Click Me";
        newButton.id = "myButton";

        // Append the button to the page's body
        document.body.appendChild(newButton);

        // Add a click event handler to the button
        newButton.addEventListener("click", () => {
          // Perform an action when the button is clicked
          alert("Button clicked!");
        });
      });
    },
  });
});
