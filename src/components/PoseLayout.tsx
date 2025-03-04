
import React from 'react';
import Header from './Header';

interface PoseLayoutProps {
  children: React.ReactNode;
}

const PoseLayout: React.FC<PoseLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <Header />
      <main className="flex-1 container max-w-7xl mx-auto px-4 pb-16">
        {children}
      </main>
      
      <footer className="py-6 border-t border-border glass bg-white/80 backdrop-blur-md">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Harmony. All rights reserved.
              </p>
            </div>
            
            <div className="flex space-x-6">
              <FooterLink href="#privacy" label="Privacy" />
              <FooterLink href="#terms" label="Terms" />
              <FooterLink href="#contact" label="Contact" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FooterLinkProps {
  href: string;
  label: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, label }) => {
  return (
    <a 
      href={href} 
      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      {label}
    </a>
  );
};

export default PoseLayout;
