
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Download, 
  Trash2, 
  ChevronRight, 
  Clock 
} from 'lucide-react';
import { 
  getMeasurementHistory, 
  downloadCSV, 
  clearMeasurementHistory, 
  PoseMeasurements 
} from '../utils/measurements';
import MeasurementDisplay from './MeasurementDisplay';

const MeasurementHistory: React.FC = () => {
  const [history, setHistory] = useState<Array<{id: string; date: string; measurements: PoseMeasurements}>>([]);
  const [selectedEntry, setSelectedEntry] = useState<{id: string; date: string; measurements: PoseMeasurements} | null>(null);
  
  useEffect(() => {
    const entries = getMeasurementHistory();
    setHistory(entries);
    
    if (entries.length > 0 && !selectedEntry) {
      setSelectedEntry(entries[entries.length - 1]);
    }
  }, []);
  
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all measurement history? This action cannot be undone.')) {
      clearMeasurementHistory();
      setHistory([]);
      setSelectedEntry(null);
    }
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="bg-white rounded-lg border border-border shadow-sm p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Measurement History</h2>
          <p className="text-sm text-muted-foreground">{history.length} saved measurements</p>
        </div>
        
        {history.length > 0 && (
          <button 
            onClick={handleClearHistory}
            className="px-3 py-1.5 rounded-md border border-destructive/30 text-destructive text-sm flex items-center gap-1.5 hover:bg-destructive/5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>
      
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No measurement history</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Your saved measurements will appear here. Take body measurements to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 border-r border-border pr-4">
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {history.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`w-full text-left px-3 py-2.5 rounded-md flex items-center justify-between transition-colors ${
                    selectedEntry?.id === entry.id
                      ? 'bg-accent/10 text-accent'
                      : 'hover:bg-secondary text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{formatDate(entry.date)}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    selectedEntry?.id === entry.id ? 'rotate-90' : ''
                  }`} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            {selectedEntry ? (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{formatDate(selectedEntry.date)}</span>
                  </div>
                  
                  <button 
                    onClick={() => downloadCSV(selectedEntry.measurements)}
                    className="px-3 py-1.5 rounded-md border border-border bg-white text-sm flex items-center gap-1.5 hover:bg-secondary transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export
                  </button>
                </div>
                
                <MeasurementDisplay measurements={selectedEntry.measurements} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-muted-foreground">Select a measurement to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasurementHistory;
