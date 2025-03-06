
import React, { useEffect, useRef, useState } from 'react';

interface WebcamProps {
  width: number;
  height: number;
  isCapturing?: boolean;
}

const Webcam: React.FC<WebcamProps> = ({ width, height, isCapturing = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannerPosition, setScannerPosition] = useState(0);
  
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: width },
            height: { ideal: height },
            facingMode: 'user'
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };
    
    startCamera();
    
    // Cleanup function to stop the camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        
        tracks.forEach(track => {
          track.stop();
        });
      }
    };
  }, [width, height]);
  
  // Animation effect for the scanner
  useEffect(() => {
    let animationFrame: number;
    
    if (isCapturing) {
      const animateScanner = () => {
        setScannerPosition(prev => {
          // Reset to top when reaching bottom
          if (prev >= 100) return 0;
          // Move scanner down slowly
          return prev + 0.5;
        });
        
        animationFrame = requestAnimationFrame(animateScanner);
      };
      
      animationFrame = requestAnimationFrame(animateScanner);
    } else {
      setScannerPosition(0);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isCapturing]);
  
  return (
    <div className="relative w-full h-full bg-black/5 backdrop-blur-sm rounded-lg overflow-hidden" style={{ minHeight: '600px' }}>
      <video 
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ minHeight: '600px' }}
      />
      
      {isCapturing && (
        <div 
          className="absolute left-0 right-0 h-1 bg-blue-500 bg-opacity-70 shadow-lg z-10 animate-pulse"
          style={{ 
            top: `${scannerPosition}%`, 
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)', 
          }}
        />
      )}
      
      {isCapturing && (
        <div className="absolute inset-0 border-2 border-blue-500 border-opacity-50 rounded-lg z-5 animate-pulse"></div>
      )}
    </div>
  );
};

export default Webcam;
