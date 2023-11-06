import React, { useState } from "react";

function CaptionsViewer({ captions }) {
  const [currentCaption, setCurrentCaption] = useState("");

  console.log("CaptionsViewer");
  const captionDivs = [];

  for (const caption of captions) {
    if (caption.includes(currentCaption)) {
      // If the current caption is included in the new caption, update the currentCaption
      setCurrentCaption(caption);
    } else {
      // If not, push the currentCaption to the divs array and update the currentCaption
      captionDivs.push(<div key={captionDivs.length}>{currentCaption}</div>);
      setCurrentCaption(caption);
    }
  }

  // Push the last currentCaption after the loop finishes
  captionDivs.push(<div key={captionDivs.length}>{currentCaption}</div>);

  return (
    <div>
      <h2>Captions Viewer</h2>
      {captionDivs}
    </div>
  );
}

export default CaptionsViewer;
