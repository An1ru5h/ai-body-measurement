
import React, { useState, useEffect } from 'react';

export interface Landmark {
  id: string;
  x: number;
  y: number;
}

export interface Connection {
  from: string;
  to: string;
}

interface LandmarkVisualizationProps {
  landmarks: Landmark[];
  connections: Connection[];
  width: number;
  height: number;
  className?: string;
}

const LandmarkVisualization: React.FC<LandmarkVisualizationProps> = ({
  landmarks,
  connections,
  width,
  height,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [landmarks]);

  const getPointById = (id: string): Landmark | undefined => {
    return landmarks.find(landmark => landmark.id === id);
  };

  return (
    <div 
      className={`relative bg-black/5 backdrop-blur-sm rounded-lg overflow-hidden transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={{ width, height }}
    >
      {/* Connections */}
      {connections.map((connection, index) => {
        const fromPoint = getPointById(connection.from);
        const toPoint = getPointById(connection.to);

        if (!fromPoint || !toPoint) return null;

        // Calculate line angle and length
        const dx = toPoint.x - fromPoint.x;
        const dy = toPoint.y - fromPoint.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const length = Math.sqrt(dx * dx + dy * dy);

        return (
          <div
            key={`connection-${index}`}
            className="landmark-connection"
            style={{
              width: `${length}px`,
              left: `${fromPoint.x}px`,
              top: `${fromPoint.y}px`,
              transform: `rotate(${angle}deg)`,
              transformOrigin: 'left center',
              transition: 'all 300ms ease-out',
            }}
          />
        );
      })}

      {/* Landmarks */}
      {landmarks.map((landmark) => (
        <div
          key={landmark.id}
          className="landmark-point"
          style={{
            left: `${landmark.x - 4}px`,
            top: `${landmark.y - 4}px`,
            transition: 'all 300ms ease-out',
          }}
        />
      ))}
    </div>
  );
};

export default LandmarkVisualization;
