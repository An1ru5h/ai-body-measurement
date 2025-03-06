
import React, { useEffect, useRef } from 'react';

interface WebcamProps {
  width: number;
  height: number;
}

const Webcam: React.FC<WebcamProps> = ({ width, height }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
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
  
  return (
    <div className="relative w-full h-full bg-black/5 backdrop-blur-sm rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
      <video 
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default Webcam;
