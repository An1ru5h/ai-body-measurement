
import React from 'react';
import { Camera } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="relative z-10 glass bg-white/90 backdrop-blur-md border-b border-border py-4 mb-6">
      <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 animate-fade-in">
          <div className="rounded-full bg-accent/10 p-2">
            <Camera className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-semibold tracking-tight">Harmony</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Precise Body Measurements</p>
          </div>
        </div>
        
        <nav className="hidden md:flex space-x-8 items-center">
          <NavLink href="#measurement" label="Measurement" />
          <NavLink href="#history" label="History" />
          <NavLink href="#about" label="About" />
        </nav>
        
        <div className="md:hidden">
          <button className="p-2 rounded-md hover:bg-secondary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  href: string;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label }) => {
  return (
    <a 
      href={href} 
      className="text-sm font-medium text-foreground/80 hover:text-foreground relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
    >
      {label}
    </a>
  );
};

export default Header;
