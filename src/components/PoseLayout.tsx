
import React from 'react';

interface PoseLayoutProps {
  children: React.ReactNode;
}

const PoseLayout: React.FC<PoseLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <main className="flex-1 container max-w-7xl mx-auto px-4 pb-16 pt-6">
        {children}
      </main>
    </div>
  );
};

export default PoseLayout;
