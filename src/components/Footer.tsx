import React from 'react';
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-cybergray-50 dark:bg-cybergray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyberblue-400 to-cyberblue-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">CI</span>
              </div>
              <h1 className="text-xl font-semibold text-cybergray-900 dark:text-white">
                CyberLoophole <span className="text-cyberblue-500">Inspectify</span>
              </h1>
            </div>
            <p className="text-cybergray-600 dark:text-cybergray-400 mt-2 max-w-md">
              Real-time monitoring and analysis of cyber threats in Indian cyberspace
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div>
              <h3 className="text-sm font-semibold text-cybergray-900 dark:text-white uppercase tracking-wider mb-3">
                Platform
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors">
                    Threat Analysis
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors">
                    Incidents
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-cybergray-900 dark:text-white uppercase tracking-wider mb-3">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors">
                    Security News
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-cybergray-200 dark:border-cybergray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-cybergray-600 dark:text-cybergray-400 text-sm">
            &copy; {new Date().getFullYear()} CyberLoophole Inspectify. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;