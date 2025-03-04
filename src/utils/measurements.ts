
export interface Measurement {
  id: string;
  name: string;
  value: number;
  unit: string;
}

export interface MeasurementGroup {
  id: string;
  title: string;
  measurements: Measurement[];
}

export interface PoseLandmark {
  x: number;
  y: number;
}

export interface PoseMeasurements {
  shoulderWidth: number;
  hipWidth: number;
  torsoLength: number;
  leftLegLength: number;
  rightLegLength: number;
  leftArmLength: number;
  rightArmLength: number;
  chestWidth: number;
  waistWidth: number;
  sleeveLength: number;
  neckLength: number;
  armholeLength: number;
  inseamLength: number;
  outseamLength: number;
  thighWidth: number;
  kneeWidth: number;
  cuffLength: number;
  backLength: number;
}

export const calculateDistance = (point1: PoseLandmark, point2: PoseLandmark): number => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

export const pixelsToUnit = (pixels: number, calibrationFactor: number = 1): number => {
  // In a real app, you would have a calibration system to convert from pixels to cm/inches
  return Number((pixels * calibrationFactor).toFixed(1));
};

export const formatMeasurements = (measurements: PoseMeasurements): MeasurementGroup[] => {
  return [
    {
      id: 'torso',
      title: 'Torso Measurements',
      measurements: [
        { id: 'shoulder-width', name: 'Shoulder Width', value: measurements.shoulderWidth, unit: 'cm' },
        { id: 'chest-width', name: 'Chest Width', value: measurements.chestWidth, unit: 'cm' },
        { id: 'waist-width', name: 'Waist Width', value: measurements.waistWidth, unit: 'cm' },
        { id: 'hip-width', name: 'Hip Width', value: measurements.hipWidth, unit: 'cm' },
        { id: 'torso-length', name: 'Torso Length', value: measurements.torsoLength, unit: 'cm' },
        { id: 'back-length', name: 'Back Length', value: measurements.backLength, unit: 'cm' },
      ]
    },
    {
      id: 'arms',
      title: 'Arm Measurements',
      measurements: [
        { id: 'left-arm-length', name: 'Left Arm Length', value: measurements.leftArmLength, unit: 'cm' },
        { id: 'right-arm-length', name: 'Right Arm Length', value: measurements.rightArmLength, unit: 'cm' },
        { id: 'sleeve-length', name: 'Sleeve Length', value: measurements.sleeveLength, unit: 'cm' },
        { id: 'armhole-length', name: 'Armhole Length', value: measurements.armholeLength, unit: 'cm' },
      ]
    },
    {
      id: 'legs',
      title: 'Leg Measurements',
      measurements: [
        { id: 'left-leg-length', name: 'Left Leg Length', value: measurements.leftLegLength, unit: 'cm' },
        { id: 'right-leg-length', name: 'Right Leg Length', value: measurements.rightLegLength, unit: 'cm' },
        { id: 'inseam-length', name: 'Inseam Length', value: measurements.inseamLength, unit: 'cm' },
        { id: 'outseam-length', name: 'Outseam Length', value: measurements.outseamLength, unit: 'cm' },
        { id: 'thigh-width', name: 'Thigh Width', value: measurements.thighWidth, unit: 'cm' },
        { id: 'knee-width', name: 'Knee Width', value: measurements.kneeWidth, unit: 'cm' },
      ]
    },
    {
      id: 'other',
      title: 'Other Measurements',
      measurements: [
        { id: 'neck-length', name: 'Neck Length', value: measurements.neckLength, unit: 'cm' },
        { id: 'cuff-length', name: 'Cuff Length', value: measurements.cuffLength, unit: 'cm' },
      ]
    }
  ];
};

export const mockMeasurements: PoseMeasurements = {
  shoulderWidth: 40.5,
  hipWidth: 38.2,
  torsoLength: 55.8,
  leftLegLength: 82.3,
  rightLegLength: 82.5,
  leftArmLength: 65.4,
  rightArmLength: 65.6,
  chestWidth: 42.0,
  waistWidth: 33.7,
  sleeveLength: 60.1,
  neckLength: 37.2,
  armholeLength: 22.5,
  inseamLength: 78.6,
  outseamLength: 103.2,
  thighWidth: 22.8,
  kneeWidth: 14.5,
  cuffLength: 15.3,
  backLength: 42.8,
};

export const exportMeasurementsToCSV = (measurements: PoseMeasurements): string => {
  const formattedMeasurements = formatMeasurements(measurements);
  let csvContent = "Measurement,Value,Unit\n";
  
  formattedMeasurements.forEach(group => {
    group.measurements.forEach(measurement => {
      csvContent += `${measurement.name},${measurement.value},${measurement.unit}\n`;
    });
  });
  
  return csvContent;
};

export const downloadCSV = (measurements: PoseMeasurements): void => {
  const csvContent = exportMeasurementsToCSV(measurements);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  
  link.setAttribute('href', url);
  link.setAttribute('download', `measurements_${date}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const saveMeasurementToHistory = (measurements: PoseMeasurements): void => {
  const history = getMeasurementHistory();
  const entry = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    measurements
  };
  
  localStorage.setItem('measurement-history', JSON.stringify([...history, entry]));
};

export const getMeasurementHistory = (): Array<{id: string; date: string; measurements: PoseMeasurements}> => {
  const history = localStorage.getItem('measurement-history');
  return history ? JSON.parse(history) : [];
};

export const clearMeasurementHistory = (): void => {
  localStorage.removeItem('measurement-history');
};
