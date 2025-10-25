"use client";

import React from "react";

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0" style={{ zIndex: -1 }}>
      {/* Main gradient background with inline animation */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(270deg, #001f3d, #045174)',
          backgroundSize: '200% 200%',
          animation: 'gradientMove 15s ease infinite'
        }}
      />
      
      {/* Animated particles */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              backgroundColor: '#d89c60',
              opacity: 0.2,
              width: `${5 + (i * 1.5)}px`,
              height: `${5 + (i * 1.5)}px`,
              top: `${10 + (i * 5)}%`,
              left: `${5 + (i * 6)}%`,
              animation: `particleFloat 12s ease-in-out ${i * 0.5}s infinite`,
            }}
          />
        ))}
      </div>
      
      {/* CSS animations defined inline */}
      <style jsx>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes particleFloat {
          0% { 
            transform: translateY(0) rotate(0deg) translateX(0);
            opacity: 0.2;
          }
          33% { 
            transform: translateY(-15px) rotate(5deg) translateX(10px);
            opacity: 0.3;
          }
          66% { 
            transform: translateY(-25px) rotate(-5deg) translateX(-10px);
            opacity: 0.25;
          }
          100% { 
            transform: translateY(0) rotate(0deg) translateX(0);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;