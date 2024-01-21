import React from "react";

// function CaptionsViewer({ captions }) {
const CaptionsViewer = ({ captions }) => {
  // const combinedCaptions = [];
  // for (let caption of captions) {
  //   caption = caption.replace(/\n/g, ""); // Remove line breaks before adding to lastCaption

  //   if (combinedCaptions.length === 0) {
  //     combinedCaptions.push(caption);
  //   } else {
  //     const lastCaption = combinedCaptions[combinedCaptions.length - 1].replace(
  //       /\n/g,
  //       ""
  //     );
  //     if (
  //       caption.startsWith(lastCaption) ||
  //       lastCaption.startsWith(caption) ||
  //       (typeof caption === "string"
  //         ? caption.toLowerCase().slice(0, -1)
  //         : "") ===
  //         (typeof lastCaption === "string"
  //           ? lastCaption.toLowerCase().slice(0, -1)
  //           : "") ||
  //       (caption.length > 60 &&
  //         // lastCaption.toLowerCase.includes(caption.toLowerCase.slice(0, 40)))

  //         (typeof lastCaption === "string"
  //           ? lastCaption
  //               .toLowerCase()
  //               .includes(
  //                 typeof caption === "string"
  //                   ? caption.toLowerCase().slice(0, 40)
  //                   : ""
  //               )
  //           : ""))
  //     ) {
  //       // If the new caption starts with the previous one or vice versa, combine them.
  //       combinedCaptions[combinedCaptions.length - 1] = caption;
  //     } else {
  //       // If not, push the new caption to the array.
  //       combinedCaptions.push(caption);
  //     }
  //   }
  // }
  // console.log("combinedCaptions : ", combinedCaptions);

  return (
    <div style={{ width: "80%" }}>
      <h3>Captions Viewer</h3>

      {captions.map((caption, index) => (
        <div key={index}>{caption}</div>
      ))}
    </div>
  );
};

export default CaptionsViewer;
