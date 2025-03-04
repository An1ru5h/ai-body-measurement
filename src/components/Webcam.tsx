
import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';

interface WebcamProps {
  onCapture?: (imageData: string) => void;
  width?: number;
  height?: number;
  showControls?: boolean;
}

const Webcam: React.FC<WebcamProps> = ({ 
  onCapture, 
  width = 640, 
  height = 480, 
  showControls = true 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const userMediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: width },
          height: { ideal: height },
          facingMode: 'user' 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = userMediaStream;
        setStream(userMediaStream);
        setIsActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Camera access denied. Please check your permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsActive(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current && isActive) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        const imageData = canvas.toDataURL('image/png');
        if (onCapture) {
          onCapture(imageData);
        }
        return imageData;
      }
    }
    return null;
  };

  useEffect(() => {
    // Auto-start camera when component mounts
    startCamera();
    
    // Clean up by stopping camera when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="relative rounded-lg overflow-hidden smooth-transition subtle-shadow">
      {/* Camera feed */}
      <div className="bg-black relative aspect-video overflow-hidden rounded-lg">
        <video 
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Camera overlay */}
        <div className="absolute inset-0 pointer-events-none border border-accent/20 rounded-lg"></div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
        
        {/* Error state */}
        {error && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-6">
            <CameraOff className="w-10 h-10 text-white/80 mb-4" />
            <p className="text-white text-center text-sm mb-4">{error}</p>
            <button 
              onClick={startCamera}
              className="px-4 py-2 rounded-full bg-accent text-white text-sm flex items-center gap-2 hover:bg-accent/90 transition-colors"
            >
              <Camera className="w-4 h-4" />
              Retry
            </button>
          </div>
        )}
      </div>
      
      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          {isActive ? (
            <button 
              onClick={stopCamera}
              className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors"
              aria-label="Stop camera"
            >
              <CameraOff className="w-5 h-5 text-destructive" />
            </button>
          ) : (
            <button 
              onClick={startCamera}
              className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors"
              aria-label="Start camera"
            >
              <Camera className="w-5 h-5 text-accent" />
            </button>
          )}
        </div>
      )}
      
      {/* Hidden canvas for capturing images */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Webcam;
