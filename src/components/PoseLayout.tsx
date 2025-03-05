
import React from 'react';

interface PoseLayoutProps {
  children: React.ReactNode;
}

const PoseLayout: React.FC<PoseLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f8f8] dark:bg-[#0a0a0a]">
      <header className="w-full py-4 border-b border-[#e0e0e0] dark:border-[#222] bg-white dark:bg-black">
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">Harmony</h1>
        </div>
      </header>
      <main className="flex-1 container max-w-7xl mx-auto px-4 pb-16 pt-6">
        {children}
      </main>
    </div>
  );
};

export default PoseLayout;
