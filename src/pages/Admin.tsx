import Header from "../components/Header";
import AdminTools from "../components/AdminTools";
import { useState } from "react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("database");

  return (
    <div className="min-h-screen bg-white dark:bg-cyberdark overflow-x-hidden">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-cybergray-900 dark:text-white mb-6">
              Admin Dashboard
            </h1>
            
            <div className="cyber-card mb-8">
              <div className="flex border-b border-cybergray-200 dark:border-cybergray-800">
                <button
                  className={`flex-1 py-3 px-4 text-center transition-colors ${
                    activeTab === "database"
                      ? "text-cyberblue-500 border-b-2 border-cyberblue-500"
                      : "text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-500"
                  }`}
                  onClick={() => setActiveTab("database")}
                >
                  Database Management
                </button>
              </div>
              
              {activeTab === "database" && (
                <div className="p-6">
                  <AdminTools />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;