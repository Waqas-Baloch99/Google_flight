// Contact.tsx
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 transform hover:shadow-2xl transition-all duration-300">
        <h1 className="text-4xl font-bold mb-6 text-blue-800 text-center">
          Let's Connect
        </h1>
        <div className="space-y-8">
          <p className="text-lg text-gray-600 text-center">
            Feel free to reach out through any of these platforms
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {/* Email Contact */}
            <a 
              href="mailto:waqaskhosa99@gmail.com"
              className="flex items-center space-x-3 px-6 py-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-blue-600 font-medium text-lg">Email</span>
            </a>

            {/* GitHub Profile */}
            <a 
              href="https://github.com/waqas-baloch99" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-3 px-6 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span className="text-gray-700 font-medium text-lg">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
