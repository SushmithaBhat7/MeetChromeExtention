import React, { useEffect, useState } from "react";

const CaptionsViewer = () => {
  const [captions, setCaptions] = useState([]);

  useEffect(() => {
    chrome.storage.local.get("captions", (data) => {
      const storedCaptions = data.captions || [];
      setCaptions(storedCaptions);
    });
  }, []);
  console.log("captions :", { captions });
  return (
    <div>
      <h2>Captions Viewer</h2>
      {captions.map((caption, index) => (
        <div key={index}>{caption}</div>
      ))}
    </div>
  );
};

export default CaptionsViewer;
