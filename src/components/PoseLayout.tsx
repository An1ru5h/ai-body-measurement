
import React from 'react';

interface PoseLayoutProps {
  children: React.ReactNode;
}

const PoseLayout: React.FC<PoseLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f8f8] dark:bg-[#0a0a0a]">
      <main className="flex-1 container max-w-7xl mx-auto px-4 pb-16 pt-6">
        {children}
      </main>
    </div>
  );
};

export default PoseLayout;
