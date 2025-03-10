import React, { useEffect, useState } from 'react';
import { Measurement, downloadCSV } from '../utils/measurements';
import { Download, Shield } from 'lucide-react';

interface MeasurementDisplayProps {
  measurements: Measurement[];
  isLive: boolean;
  showZeroed?: boolean;
}

const MeasurementDisplay: React.FC<MeasurementDisplayProps> = ({ 
  measurements, 
  isLive, 
  showZeroed = false 
}) => {
  const [displayValues, setDisplayValues] = useState<Measurement[]>(measurements);
  const [hasStartedScan, setHasStartedScan] = useState(false);
  const [hasCompletedScan, setHasCompletedScan] = useState(false);

  useEffect(() => {
    // Track if a scan has ever started
    if (showZeroed && !hasStartedScan) {
      setHasStartedScan(true);
    }
    
    // If scan is completed (was started but now stopped), mark it as completed
    if (hasStartedScan && !showZeroed && isLive && !hasCompletedScan) {
      setHasCompletedScan(true);
    }
    
    // If zeroed is requested or we stopped in the middle of a scan
    if (showZeroed || (hasStartedScan && !showZeroed && isLive)) {
      // Start with zeroed measurements
      const zeroed = measurements.map(m => ({ ...m, value: 0 }));
      setDisplayValues(zeroed);

      // Only set up interval to update with random values if we're actively scanning
      // or we've completed a scan (to keep showing random values)
      if (showZeroed || hasCompletedScan) {
        const interval = setInterval(() => {
          setDisplayValues(prev => 
            prev.map(m => {
              const originalMeasurement = measurements.find(om => om.id === m.id);
              if (!originalMeasurement) return m;
              
              // Generate a value that gradually approaches the real measurement
              // with some random fluctuation (between 70% and 95% of the real value)
              const randomFactor = 0.7 + (Math.random() * 0.25);
              const newValue = originalMeasurement.value * randomFactor;
              
              return {
                ...m,
                value: parseFloat(newValue.toFixed(1))
              };
            })
          );
        }, 500); // Update every half second

        return () => clearInterval(interval);
      }
    } else if (!isLive) {
      // Only show real measurements if we're viewing history
      setDisplayValues(measurements);
      setHasStartedScan(false);
      setHasCompletedScan(false);
    }
  }, [measurements, showZeroed, isLive, hasStartedScan, hasCompletedScan]);
    
  const avgConfidence = displayValues.reduce((sum, m) => sum + m.confidence, 0) / displayValues.length;
  
  const handleExport = () => {
    downloadCSV(measurements);
  };
  
  return (
    <div className="bg-white dark:bg-black rounded-lg border border-[#e0e0e0] dark:border-[#222] shadow-sm animate-fade-in h-full">
      <div className="border-b border-[#e0e0e0] dark:border-[#222] p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-black dark:text-white">Body Measurements</h2>
          <p className="text-sm text-[#666] dark:text-[#999]">
            {isLive ? 'Current measurements in real-time' : 'Previous measurement session'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-[#f0f0f0] dark:bg-[#222] text-black dark:text-white rounded-md text-xs">
            <Shield className="w-3 h-3" />
            <span>{(avgConfidence * 100).toFixed(0)}% Confidence</span>
          </div>
          
          <button 
            onClick={handleExport}
            className="p-2 rounded-md hover:bg-[#f0f0f0] dark:hover:bg-[#222] transition-colors"
            title="Download CSV"
          >
            <Download className="w-4 h-4 text-black dark:text-white" />
          </button>
        </div>
      </div>
      
      <div className="p-4 max-h-[600px] overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-[450px]">
          {displayValues.map((measurement) => (
            <div 
              key={measurement.id}
              className="p-3 border border-[#e0e0e0] dark:border-[#333] rounded-md hover:bg-[#f8f8f8] dark:hover:bg-[#111] transition-colors"
            >
              <div className="text-sm font-medium text-[#666] dark:text-[#999] mb-1">
                {measurement.name}
              </div>
              <div className="text-2xl font-semibold tracking-tight text-black dark:text-white">
                {measurement.value.toFixed(1)}
                <span className="text-sm font-normal text-[#666] dark:text-[#999] ml-1">
                  {measurement.unit}
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full bg-[#eaeaea] dark:bg-[#222] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-black dark:bg-white"
                  style={{ width: `${measurement.confidence * 100}%` }}
                ></div>
              </div>
              <div className="mt-1 text-xs text-right text-[#666] dark:text-[#999]">
                {(measurement.confidence * 100).toFixed(0)}% confidence
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeasurementDisplay;
