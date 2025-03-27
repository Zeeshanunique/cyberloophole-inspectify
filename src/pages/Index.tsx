
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import ThreatAnalysis from "../components/ThreatAnalysis";
import { useEffect } from "react";

const Index = () => {
  // Add smooth scroll behavior for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.substring(1);
        const element = document.getElementById(id || '');
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80, // Account for fixed header
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-cyberdark overflow-x-hidden">
      <Header />
      <Dashboard />
      <ThreatAnalysis />

      {/* Prevention Section */}
      <div className="py-16 bg-white dark:bg-cyberdark" id="prevention">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-cybergray-900 dark:text-white mb-4">Preventive Measures</h2>
            <p className="text-cybergray-600 dark:text-cybergray-400">
              Comprehensive strategies to protect critical information infrastructure against evolving cyber threats
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="cyber-card p-6 animate-slide-up" style={{ animationDelay: "0ms" }}>
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-cybergray-900 dark:text-white mb-2">Find Loopholes</h3>
              <p className="text-cybergray-600 dark:text-cybergray-400 mb-4">
                Proactive vulnerability assessment and penetration testing to identify security gaps before they can be exploited.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-0.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-cybergray-700 dark:text-cybergray-300">Automated vulnerability scanning</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-0.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-cybergray-700 dark:text-cybergray-300">Manual penetration testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-0.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-cybergray-700 dark:text-cybergray-300">Code security review</span>
                </li>
              </ul>
            </div>

            <div className="cyber-card p-6 animate-slide-up" style={{ animationDelay: "150ms" }}>
              <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400">
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                  <path d="M3.58 5.55A9.97 9.97 0 0 1 12 2c5.52 0 10 4.48 10 10 0 5.23-4.02 9.53-9.12 9.97" />
                  <path d="M8.24 18.96A5.99 5.99 0 0 1 6 15c0-3.31 2.69-6 6-6s6 2.69 6 6c0 1.63-.67 3.1-1.76 4.17" />
                  <path d="M12 19v3" />
                  <path d="M9 22h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-cybergray-900 dark:text-white mb-2">Determine Threat Sources</h3>
              <p className="text-cybergray-600 dark:text-cybergray-400 mb-4">
                Advanced threat intelligence to identify and understand the actors behind cyber attacks.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-0.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-cybergray-700 dark:text-cybergray-300">Attribution analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-0.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-cybergray-700 dark:text-cybergray-300">Threat actor profiling</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-0.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-cybergray-700 dark:text-cybergray-300">IOC analysis</span>
                </li>
              </ul>
            </div>

            <div className="cyber-card p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-cybergray-900 dark:text-white mb-2">Implement Protection</h3>
              <p className="text-cybergray-600 dark:text-cybergray-400 mb-4">
                Robust security measures to prevent attacks and minimize damage from security breaches.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-0.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-cybergray-700 dark:text-cybergray-300">Zero-trust architecture</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-0.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-cybergray-700 dark:text-cybergray-300">Advanced threat protection</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-0.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-cybergray-700 dark:text-cybergray-300">Security awareness training</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="cyber-card overflow-hidden">
              <div className="bg-gradient-to-r from-cyberblue-500 to-cyberblue-700 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Comprehensive Cyber Resilience Framework</h3>
                <p className="opacity-90">
                  Building robust defenses for critical information infrastructure
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-cybergray-900 dark:text-white mb-3">Technical Measures</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyberblue-500 mt-0.5">
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                        <span className="text-cybergray-700 dark:text-cybergray-300">Advanced endpoint protection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyberblue-500 mt-0.5">
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                        <span className="text-cybergray-700 dark:text-cybergray-300">Network security monitoring</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyberblue-500 mt-0.5">
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                        <span className="text-cybergray-700 dark:text-cybergray-300">Secure access management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyberblue-500 mt-0.5">
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                        <span className="text-cybergray-700 dark:text-cybergray-300">Security information and event management (SIEM)</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-cybergray-900 dark:text-white mb-3">Organizational Measures</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyberblue-500 mt-0.5">
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                        <span className="text-cybergray-700 dark:text-cybergray-300">Incident response planning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyberblue-500 mt-0.5">
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                        <span className="text-cybergray-700 dark:text-cybergray-300">Security governance framework</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyberblue-500 mt-0.5">
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                        <span className="text-cybergray-700 dark:text-cybergray-300">Third-party risk management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyberblue-500 mt-0.5">
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                        <span className="text-cybergray-700 dark:text-cybergray-300">Regular cybersecurity drills</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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
                    <a href="#dashboard" className="text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors">
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a href="#analysis" className="text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors">
                      Threat Analysis
                    </a>
                  </li>
                  <li>
                    <a href="#incidents" className="text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors">
                      Incidents
                    </a>
                  </li>
                  <li>
                    <a href="#prevention" className="text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors">
                      Prevention
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-cybergray-900 dark:text-white uppercase tracking-wider mb-3">
                  Legal
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors">
                      Data Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-cybergray-200 dark:border-cybergray-800 text-center">
            <p className="text-cybergray-600 dark:text-cybergray-400 text-sm">
              &copy; {new Date().getFullYear()} CyberLoophole Inspectify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
