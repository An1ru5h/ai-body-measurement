
import React, { useState } from 'react';
import PoseLayout from '../components/PoseLayout';
import Webcam from '../components/Webcam';
import MeasurementDisplay from '../components/MeasurementDisplay';
import { mockMeasurements } from '../utils/measurements';
import { Play, Pause, Timer, Info } from 'lucide-react';

// Define types that were previously imported from LandmarkVisualization
interface Landmark {
  id: string;
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
}

const Index = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  
  const mockLandmarks: Landmark[] = [
    { id: "nose", x: 320, y: 120 },
    { id: "left_eye", x: 300, y: 110 },
    { id: "right_eye", x: 340, y: 110 },
    { id: "left_shoulder", x: 250, y: 200 },
    { id: "right_shoulder", x: 390, y: 200 },
    { id: "left_elbow", x: 200, y: 280 },
    { id: "right_elbow", x: 440, y: 280 },
    { id: "left_wrist", x: 220, y: 350 },
    { id: "right_wrist", x: 420, y: 350 },
    { id: "left_hip", x: 280, y: 320 },
    { id: "right_hip", x: 360, y: 320 },
    { id: "left_knee", x: 270, y: 420 },
    { id: "right_knee", x: 370, y: 420 },
    { id: "left_ankle", x: 260, y: 500 },
    { id: "right_ankle", x: 380, y: 500 },
  ];
  
  const mockConnections: Connection[] = [
    { from: "left_eye", to: "right_eye" },
    { from: "nose", to: "left_eye" },
    { from: "nose", to: "right_eye" },
    { from: "left_shoulder", to: "right_shoulder" },
    { from: "left_shoulder", to: "left_elbow" },
    { from: "right_shoulder", to: "right_elbow" },
    { from: "left_elbow", to: "left_wrist" },
    { from: "right_elbow", to: "right_wrist" },
    { from: "left_shoulder", to: "left_hip" },
    { from: "right_shoulder", to: "right_hip" },
    { from: "left_hip", to: "right_hip" },
    { from: "left_hip", to: "left_knee" },
    { from: "right_hip", to: "right_knee" },
    { from: "left_knee", to: "left_ankle" },
    { from: "right_knee", to: "right_ankle" },
  ];
  
  const startCapture = () => {
    setIsCapturing(true);
    setCaptureProgress(0);
    
    const duration = 60; // 60 seconds (1 minute) instead of 7 minutes
    const interval = 100; // Update progress every 100ms for smoother animation
    const increment = 100 / duration / (1000 / interval);
    
    const timer = setInterval(() => {
      setCaptureProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          setIsCapturing(false);
          return 100;
        }
        return newProgress;
      });
    }, interval);
  };
  
  const stopCapture = () => {
    setIsCapturing(false);
  };
  
  return (
    <PoseLayout>
      <section id="measurement" className="mb-16 scroll-mt-20">
        <div className="bg-white rounded-lg border border-border shadow-sm p-6 mb-10 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Capture Measurements</h2>
              <p className="text-sm text-muted-foreground">
                Stand in front of your camera for accurate body measurements
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {isCapturing ? (
                <button 
                  onClick={stopCapture}
                  className="px-4 py-2 rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2 hover:bg-destructive/20 transition-colors"
                >
                  <Pause className="w-4 h-4" />
                  Stop
                </button>
              ) : (
                <button 
                  onClick={startCapture}
                  className="px-4 py-2 rounded-md bg-accent text-white text-sm flex items-center gap-2 hover:bg-accent/90 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Start Capture
                </button>
              )}
              
              <div className="hidden md:flex items-center gap-2">
                <Timer className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">1 min scan</span>
              </div>
            </div>
          </div>
          
          {isCapturing && (
            <div className="mb-6">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-100 ease-linear"
                  style={{ width: `${captureProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground">Capturing...</span>
                <span className="text-xs font-medium">{Math.round(captureProgress)}%</span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Webcam width={640} height={480} />
            </div>
            <div>
              <MeasurementDisplay measurements={mockMeasurements} isLive={true} />
            </div>
          </div>
        </div>
      </section>
      
      <section id="about" className="scroll-mt-20">
        <div className="bg-white rounded-lg border border-border shadow-sm p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-full bg-accent/10">
              <Info className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight">About the Technology</h2>
          </div>
          
          <div className="prose max-w-none">
            <p>
              Harmony uses advanced computer vision and machine learning to detect and track body landmarks in real-time. 
              By analyzing the spatial relationships between these landmarks, we can calculate precise body measurements.
            </p>
            
            <h3>How It Works</h3>
            <ol>
              <li><strong>Pose Detection:</strong> Our algorithm identifies 33 key body landmarks in real-time.</li>
              <li><strong>Measurement Calculation:</strong> We analyze the distances between landmarks to determine measurements.</li>
              <li><strong>Calibration:</strong> The system calibrates to provide accurate real-world measurements.</li>
              <li><strong>Data Collection:</strong> Multiple measurements are taken over time to ensure accuracy.</li>
            </ol>
            
            <h3>Applications</h3>
            <p>
              Our technology can be used for custom clothing sizing, fitness tracking, healthcare monitoring, 
              ergonomic assessments, and more. The possibilities are endless!
            </p>
          </div>
        </div>
      </section>
    </PoseLayout>
  );
};

export default Index;
