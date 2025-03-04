
import React from 'react';
import { Download } from 'lucide-react';
import { 
  MeasurementGroup, 
  PoseMeasurements, 
  downloadCSV, 
  saveMeasurementToHistory,
  formatMeasurements 
} from '../utils/measurements';

interface MeasurementDisplayProps {
  measurements: PoseMeasurements;
  isLive?: boolean;
}

const MeasurementDisplay: React.FC<MeasurementDisplayProps> = ({ 
  measurements, 
  isLive = false 
}) => {
  const formattedGroups = formatMeasurements(measurements);
  
  const handleSave = () => {
    saveMeasurementToHistory(measurements);
  };
  
  const handleExport = () => {
    downloadCSV(measurements);
  };
  
  return (
    <div className="smooth-transition">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Body Measurements</h2>
          <p className="text-sm text-muted-foreground">{isLive ? "Live Analysis" : "Measured on " + new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleSave}
            className="px-4 py-2 rounded-md border border-border bg-white text-sm hover:bg-secondary transition-colors"
          >
            Save
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-2 rounded-md bg-accent text-white text-sm flex items-center gap-2 hover:bg-accent/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formattedGroups.map((group) => (
          <MeasurementGroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
};

interface MeasurementGroupCardProps {
  group: MeasurementGroup;
}

const MeasurementGroupCard: React.FC<MeasurementGroupCardProps> = ({ group }) => {
  return (
    <div className="measurement-card animate-scale-in">
      <h3 className="font-medium mb-3">{group.title}</h3>
      <div className="space-y-2">
        {group.measurements.map((measurement) => (
          <div key={measurement.id} className="flex justify-between items-center py-1 border-b border-border last:border-0">
            <span className="text-sm">{measurement.name}</span>
            <span className="font-mono text-sm font-medium">
              {measurement.value} {measurement.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeasurementDisplay;
