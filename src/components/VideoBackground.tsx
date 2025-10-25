"use client";

import React from "react";

const VideoBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 h-screen w-full overflow-hidden" style={{ zIndex: -1 }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          minWidth: "100%",
          minHeight: "100%",
          width: "auto",
          height: "auto",
          transform: "translate(-50%, -50%)",
        }}
      >
        <source src="/images/city.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
    </div>
  );
};

export default VideoBackground;