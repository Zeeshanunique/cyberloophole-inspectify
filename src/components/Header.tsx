
import { useState, useEffect } from "react";
import { Bell, Search, Menu, X } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-cyberdark/80 backdrop-blur shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyberblue-400 to-cyberblue-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">CI</span>
            </div>
            <h1 className="text-xl font-semibold text-cybergray-900 dark:text-white hidden sm:block">
              CyberLoophole <span className="text-cyberblue-500">Inspectify</span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#dashboard"
              className="text-cybergray-700 dark:text-cybergray-200 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors duration-200"
            >
              Dashboard
            </a>
            <a
              href="#analysis"
              className="text-cybergray-700 dark:text-cybergray-200 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors duration-200"
            >
              Threat Analysis
            </a>
            <a
              href="#incidents"
              className="text-cybergray-700 dark:text-cybergray-200 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors duration-200"
            >
              Incidents
            </a>
            <a
              href="#prevention"
              className="text-cybergray-700 dark:text-cybergray-200 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors duration-200"
            >
              Prevention
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full text-cybergray-600 hover:text-cyberblue-500 dark:text-cybergray-400 dark:hover:text-cyberblue-400 transition-colors duration-200">
              <Search size={20} />
            </button>
            <button className="p-2 rounded-full text-cybergray-600 hover:text-cyberblue-500 dark:text-cybergray-400 dark:hover:text-cyberblue-400 transition-colors duration-200 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 bg-cyberalert-critical rounded-full"></span>
            </button>
            <button
              className="md:hidden p-2 rounded-full text-cybergray-600 hover:text-cyberblue-500 dark:text-cybergray-400 dark:hover:text-cyberblue-400 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-cyberdark shadow-lg animate-slide-down">
          <nav className="flex flex-col p-4 space-y-3">
            <a
              href="#dashboard"
              className="text-cybergray-700 dark:text-cybergray-200 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors duration-200 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </a>
            <a
              href="#analysis"
              className="text-cybergray-700 dark:text-cybergray-200 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors duration-200 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Threat Analysis
            </a>
            <a
              href="#incidents"
              className="text-cybergray-700 dark:text-cybergray-200 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors duration-200 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Incidents
            </a>
            <a
              href="#prevention"
              className="text-cybergray-700 dark:text-cybergray-200 hover:text-cyberblue-500 dark:hover:text-cyberblue-400 transition-colors duration-200 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Prevention
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
