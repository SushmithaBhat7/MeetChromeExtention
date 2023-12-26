/* eslint-disable react/prop-types */
import React from "react";

// function CaptionsViewer({ captions }) {
const CaptionsViewer = ({ captions }) => {
  const combinedCaptions = [];
  console.log("captions :", captions);
  // for (let caption of captions) {
  //   caption = caption.replace(/\n/g, ""); // Remove line breaks before adding to lastCaption

  //   if (combinedCaptions.length === 0) {
  //     combinedCaptions.push(caption);
  //   } else {
  //     const lastCaption = combinedCaptions[combinedCaptions.length - 1].replace(
  //       /\n/g,
  //       ""
  //     );
  //     if (caption.startsWith(lastCaption) || lastCaption.startsWith(caption)) {
  //       // If the new caption starts with the previous one or vice versa, combine them.
  //       combinedCaptions[combinedCaptions.length - 1] = caption;
  //     } else {
  //       // If not, push the new caption to the array.
  //       combinedCaptions.push(caption);
  //     }
  //   }
  // }
  // console.log("combinedCaptions : ", combinedCaptions);

  // return (
  //   <div>
  //     <h3>Captions Viewer</h3>
  //     {combinedCaptions.map((caption, index) => (
  //       <div key={index}>{caption}</div>
  //     ))}
  //   </div>
  // );

  // console.log("combinedCaptions : ", combinedCaptions);

  return (
    <div>
      {captions.map((msg, index) => (
        <div key={index}>
          <strong>{msg.name}:</strong> {msg.message}
        </div>
      ))}
    </div>
  );
};

export default CaptionsViewer;
