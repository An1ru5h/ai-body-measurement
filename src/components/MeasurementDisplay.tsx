
import React from 'react';
import { Measurement, downloadCSV } from '../utils/measurements';
import { Download, Shield } from 'lucide-react';

interface MeasurementDisplayProps {
  measurements: Measurement[];
  isLive: boolean;
}

const MeasurementDisplay: React.FC<MeasurementDisplayProps> = ({ measurements, isLive }) => {
  const avgConfidence = measurements.reduce((sum, m) => sum + m.confidence, 0) / measurements.length;
  
  const handleExport = () => {
    downloadCSV(measurements);
  };
  
  return (
    <div className="bg-white rounded-lg border border-border shadow-sm animate-fade-in">
      <div className="border-b border-border p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Body Measurements</h2>
          <p className="text-sm text-muted-foreground">
            {isLive ? 'Current measurements in real-time' : 'Previous measurement session'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-xs">
            <Shield className="w-3 h-3" />
            <span>{(avgConfidence * 100).toFixed(0)}% Confidence</span>
          </div>
          
          <button 
            onClick={handleExport}
            className="p-2 rounded-md hover:bg-secondary transition-colors"
            title="Download CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {measurements.map((measurement) => (
            <div 
              key={measurement.id}
              className="p-3 border border-border rounded-md hover:bg-secondary/50 transition-colors"
            >
              <div className="text-sm font-medium text-muted-foreground mb-1">
                {measurement.name}
              </div>
              <div className="text-2xl font-semibold tracking-tight">
                {measurement.value.toFixed(1)}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {measurement.unit}
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent"
                  style={{ width: `${measurement.confidence * 100}%` }}
                ></div>
              </div>
              <div className="mt-1 text-xs text-right text-muted-foreground">
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
