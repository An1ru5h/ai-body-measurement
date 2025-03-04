
import React, { useState } from 'react';
import PoseLayout from '../components/PoseLayout';
import Webcam from '../components/Webcam';
import MeasurementDisplay from '../components/MeasurementDisplay';
import MeasurementHistory from '../components/MeasurementHistory';
import LandmarkVisualization, { Landmark, Connection } from '../components/LandmarkVisualization';
import { mockMeasurements } from '../utils/measurements';
import { Play, Pause, Timer, Info, ArrowRight, ChevronDown } from 'lucide-react';

const Index = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'live' | 'history'>('live');
  
  // Mock landmarks - in a real app these would come from the pose detection
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
    
    // Simulate progress - in a real app, this would be based on the actual capture progress
    const duration = 7 * 60; // 7 minutes in seconds
    const interval = 1000; // Update every second
    const increment = 100 / duration;
    
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
      <section id="hero" className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 md:pr-6">
            <div className="animate-fade-in">
              <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mr-1.5"></div>
                Body Measurement Technology
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4">
                Precise Body <br/>
                <span className="text-accent">Measurements</span>
              </h1>
              
              <p className="text-muted-foreground text-lg mb-6">
                Transform how you measure the human body with our advanced pose estimation technology. Get accurate measurements in minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('measurement')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3 rounded-md bg-accent text-white hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                >
                  Start Measuring
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3 rounded-md border border-border hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                >
                  Learn More
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden subtle-shadow animate-scale-in">
              <LandmarkVisualization 
                landmarks={mockLandmarks}
                connections={mockConnections}
                width={640}
                height={480}
                className="w-full h-full"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-accent/10 rounded-full filter blur-3xl -z-10"></div>
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-accent/10 rounded-full filter blur-3xl -z-10"></div>
          </div>
        </div>
      </section>
      
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
                <span className="text-sm text-muted-foreground">7 min session</span>
              </div>
            </div>
          </div>
          
          {isCapturing && (
            <div className="mb-6">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-300 ease-linear"
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
              <LandmarkVisualization 
                landmarks={mockLandmarks}
                connections={mockConnections}
                width={640}
                height={480}
                className="w-full h-full bg-black/5 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 border-b border-border mb-6">
          <button
            onClick={() => setViewMode('live')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              viewMode === 'live' 
                ? 'text-accent' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Live Measurements
            {viewMode === 'live' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"></div>
            )}
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              viewMode === 'history' 
                ? 'text-accent' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Measurement History
            {viewMode === 'history' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"></div>
            )}
          </button>
        </div>
        
        {viewMode === 'live' ? (
          <MeasurementDisplay measurements={mockMeasurements} isLive={true} />
        ) : (
          <div id="history" className="scroll-mt-20">
            <MeasurementHistory />
          </div>
        )}
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
