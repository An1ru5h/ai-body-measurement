
import React, { useState } from 'react';
import { historicalData, groupMeasurementsByDate, downloadCSV } from '../utils/measurements';
import { Calendar, Download, ChevronDown, ChevronRight, LineChart } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MeasurementHistory: React.FC = () => {
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});
  const [selectedMeasurement, setSelectedMeasurement] = useState<string>("Shoulder Width");
  
  const groupedByDate = groupMeasurementsByDate(historicalData);
  const dates = Object.keys(groupedByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  const toggleDate = (date: string) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };
  
  const handleExport = () => {
    downloadCSV(historicalData, "harmony-measurement-history.csv");
  };
  
  // Prepare data for chart
  const chartData = dates.map(date => {
    const measurements = groupedByDate[date];
    const measurement = measurements.find(m => m.name === selectedMeasurement);
    
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: measurement ? measurement.value : 0
    };
  }).reverse();
  
  // Get unique measurement names
  const measurementNames = Array.from(new Set(historicalData.map(m => m.name)));
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-lg border border-border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-accent/10">
              <LineChart className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight">Measurement Trends</h2>
          </div>
          
          <div className="flex gap-3">
            <select 
              value={selectedMeasurement}
              onChange={(e) => setSelectedMeasurement(e.target.value)}
              className="text-sm border border-border rounded-md px-3 py-1.5 bg-white"
            >
              {measurementNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            
            <button
              onClick={handleExport}
              className="px-3 py-1.5 rounded-md border border-border hover:bg-secondary transition-colors text-sm flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: '8px' }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                dot={{ strokeWidth: 2 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-border shadow-sm">
        <div className="border-b border-border p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium">Measurement History</h3>
          </div>
          <div className="text-sm text-muted-foreground">
            Last 7 days
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {dates.map((date) => (
            <div key={date} className="py-2">
              <div 
                className="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() => toggleDate(date)}
              >
                <div className="font-medium">
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </div>
                <div>
                  {expandedDates[date] ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </div>
              </div>
              
              {expandedDates[date] && (
                <div className="px-4 py-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {groupedByDate[date].map((measurement) => (
                    <div 
                      key={measurement.id}
                      className="p-3 border border-border rounded-md hover:bg-secondary/50 transition-colors"
                    >
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        {measurement.name}
                      </div>
                      <div className="text-xl font-semibold tracking-tight">
                        {measurement.value.toFixed(1)}
                        <span className="text-sm font-normal text-muted-foreground ml-1">
                          {measurement.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeasurementHistory;
