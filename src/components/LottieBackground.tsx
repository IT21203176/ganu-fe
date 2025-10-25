import React from "react";
import Lottie from "lottie-react";
import animationData from "../../public/images/animation.json"; 

const LottieBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 h-screen w-full overflow-hidden" style={{ zIndex: -1 }}>
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ 
          width: "100%", 
          height: "100%",
          position: "fixed",
          top: 0,
          left: 0
        }}
        rendererSettings={{
          preserveAspectRatio: "xMidYMid slice" // This makes it cover the screen
        }}
      />
      
    </div>
  );
};

export default LottieBackground;