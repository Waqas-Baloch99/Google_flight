// Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-bold py-6 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        {/* Left Section */}
        <div className="text-center md:text-left">
          <h5 className="font-semibold text-lg">Google Flights Clone</h5>
          <p className="text-sm mt-2">
            Built by Waqas Baloch.
          </p>
        </div>
        {/* Middle Section */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a 
            href="/about" 
            className="text-sm hover:text-blue-400 transition-colors">
            About
          </a>
          <a 
            href="/contact" 
            className="text-sm hover:text-blue-400 transition-colors">
            Contact
          </a>
          <a 
            href="/terms" 
            className="text-sm hover:text-blue-400 transition-colors">
            Terms
          </a>
          <a 
            href="/privacy" 
            className="text-sm hover:text-blue-400 transition-colors">
            Privacy
          </a>
        </div>
        {/* Right Section */}
        <div className="text-center md:text-right mt-4 md:mt-0">
          <p className="text-sm">
            © {new Date().getFullYear()} Google Flights Clone. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
