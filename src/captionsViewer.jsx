import React from "react";

// function CaptionsViewer({ captions }) {
const CaptionsViewer = ({ captions }) => {
  const combinedCaptions = [];
  for (let caption of captions) {
    caption = caption.replace(/\n/g, ""); // Remove line breaks before adding to lastCaption

    if (combinedCaptions.length === 0) {
      combinedCaptions.push(caption);
    } else {
      const lastCaption = combinedCaptions[combinedCaptions.length - 1].replace(
        /\n/g,
        ""
      );
      if (caption.startsWith(lastCaption) || lastCaption.startsWith(caption)) {
        // If the new caption starts with the previous one or vice versa, combine them.
        combinedCaptions[combinedCaptions.length - 1] = caption;
      } else {
        // If not, push the new caption to the array.
        combinedCaptions.push(caption);
      }
    }
  }
  console.log("combinedCaptions : ", combinedCaptions);

  return (
    <div>
      <h2>Captions Viewer</h2>
      {combinedCaptions.map((caption, index) => (
        <div key={index}>{caption}</div>
      ))}
    </div>
  );
};

export default CaptionsViewer;
