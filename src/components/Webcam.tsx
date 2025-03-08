
import React, { useEffect, useRef, useState } from 'react';

interface WebcamProps {
  width: number;
  height: number;
  isCapturing?: boolean;
}

const Webcam: React.FC<WebcamProps> = ({ width, height, isCapturing = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannerPosition, setScannerPosition] = useState(0);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  
  useEffect(() => {
    const startCamera = async () => {
      try {
        // Request higher quality video with improved constraints
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1920, min: 1280 }, // Request higher resolution
            height: { ideal: 1080, min: 720 },
            facingMode: 'user',
            aspectRatio: { ideal: 16/9 },
            frameRate: { ideal: 30, min: 24 }, // Higher frame rate for smoother video
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play();
            }
          };
        }
        setCameraAvailable(true);
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setCameraAvailable(false);
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
    <div className="relative w-full h-full bg-black/5 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg" style={{ minHeight: '600px' }}>
      {cameraAvailable ? (
        <>
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ 
              minHeight: '600px',
              filter: 'contrast(1.05) brightness(1.05)', // Slightly enhance contrast and brightness
            }}
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
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">Camera access denied or unavailable. Please check your camera permissions.</p>
        </div>
      )}
    </div>
  );
};

export default Webcam;
