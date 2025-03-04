
export interface Measurement {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
  confidence: number;
}

// Mock data for demonstration
export const mockMeasurements: Measurement[] = [
  { id: "1", name: "Shoulder Width", value: 45.2, unit: "cm", date: new Date().toISOString(), confidence: 0.92 },
  { id: "2", name: "Hip Width", value: 42.8, unit: "cm", date: new Date().toISOString(), confidence: 0.89 },
  { id: "3", name: "Torso Length", value: 60.3, unit: "cm", date: new Date().toISOString(), confidence: 0.95 },
  { id: "4", name: "Left Leg Length", value: 90.1, unit: "cm", date: new Date().toISOString(), confidence: 0.91 },
  { id: "5", name: "Right Leg Length", value: 90.3, unit: "cm", date: new Date().toISOString(), confidence: 0.90 },
  { id: "6", name: "Left Arm Length", value: 72.5, unit: "cm", date: new Date().toISOString(), confidence: 0.93 },
  { id: "7", name: "Right Arm Length", value: 72.7, unit: "cm", date: new Date().toISOString(), confidence: 0.94 },
  { id: "8", name: "Chest Width", value: 102.4, unit: "cm", date: new Date().toISOString(), confidence: 0.87 },
  { id: "9", name: "Waist Width", value: 88.6, unit: "cm", date: new Date().toISOString(), confidence: 0.88 },
  { id: "10", name: "Inseam Length", value: 80.2, unit: "cm", date: new Date().toISOString(), confidence: 0.89 },
  { id: "11", name: "Sleeve Length", value: 62.0, unit: "cm", date: new Date().toISOString(), confidence: 0.91 },
  { id: "12", name: "Neck Length", value: 38.4, unit: "cm", date: new Date().toISOString(), confidence: 0.85 },
];

// Generate historical data (last 7 days) for the measurement history
export const generateHistoricalData = (): Measurement[] => {
  const data: Measurement[] = [];
  const today = new Date();
  
  // Generate data for each day in the last week
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Generate each measurement type for this date
    mockMeasurements.forEach((measurement) => {
      // Add some random variation to the values to simulate real measurements
      const randomVariation = (Math.random() * 0.06) - 0.03; // -3% to +3%
      const value = measurement.value * (1 + randomVariation);
      
      data.push({
        id: `${measurement.id}-${i}`,
        name: measurement.name,
        value: parseFloat(value.toFixed(1)),
        unit: measurement.unit,
        date: date.toISOString(),
        confidence: Math.min(0.99, measurement.confidence * (1 + (Math.random() * 0.1 - 0.05))),
      });
    });
  }
  
  return data;
};

export const historicalData = generateHistoricalData();

// Group measurements by date for the history view
export const groupMeasurementsByDate = (measurements: Measurement[]): Record<string, Measurement[]> => {
  const grouped: Record<string, Measurement[]> = {};
  
  measurements.forEach((measurement) => {
    const date = new Date(measurement.date).toLocaleDateString();
    
    if (!grouped[date]) {
      grouped[date] = [];
    }
    
    grouped[date].push(measurement);
  });
  
  return grouped;
};

// Calculate average confidence across all measurements
export const calculateAverageConfidence = (measurements: Measurement[]): number => {
  if (measurements.length === 0) return 0;
  
  const sum = measurements.reduce((acc, measurement) => acc + measurement.confidence, 0);
  return sum / measurements.length;
};

// Export measurements to CSV format
export const exportMeasurementsToCSV = (measurements: Measurement[]): string => {
  const headers = "Name,Value,Unit,Date,Confidence\n";
  
  const rows = measurements.map((measurement) => {
    const date = new Date(measurement.date).toLocaleDateString();
    return `${measurement.name},${measurement.value},${measurement.unit},${date},${measurement.confidence.toFixed(2)}`;
  }).join('\n');
  
  return headers + rows;
};

// Function to download CSV file
export const downloadCSV = (measurements: Measurement[], filename = "harmony-measurements.csv"): void => {
  const csv = exportMeasurementsToCSV(measurements);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  
  a.click();
  document.body.removeChild(a);
};
