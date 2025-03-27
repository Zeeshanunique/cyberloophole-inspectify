import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Shield, AlertTriangle, Activity } from "lucide-react";
import { incidentCategories, targetSectors } from "../utils/mockData";
import { useQuery } from "@tanstack/react-query";
import { fetchIncidents } from "../utils/supabaseQueries";
import { Skeleton } from "@/components/ui/skeleton";

const ThreatAnalysis = () => {
  const [activeTab, setActiveTab] = useState("categories");

  // Fetch incidents
  const { data: incidents = [], isLoading, error } = useQuery({
    queryKey: ['incidents'],
    queryFn: fetchIncidents,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="py-16 bg-cybergray-50 dark:bg-cyberdark" id="analysis">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Skeleton className="h-8 w-64 mx-auto mb-3" />
              <Skeleton className="h-4 w-80 mx-auto" />
            </div>
            <div className="cyber-card mb-8">
              <Skeleton className="h-12 w-full" />
              <div className="p-6">
                <Skeleton className="h-6 w-48 mb-6" />
                <Skeleton className="h-[400px] w-full mb-6" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-16 bg-cybergray-50 dark:bg-cyberdark" id="analysis">
        <div className="container mx-auto px-4 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error Loading Analysis Data</h2>
          <p className="text-cybergray-600 dark:text-cybergray-400 mb-4">
            There was a problem loading the analysis data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  // Get unique categories and sectors from the data
  const uniqueCategories = [...new Set(incidents.map(incident => incident.category))];
  const uniqueSectors = [...new Set(incidents.map(incident => incident.target_sector))];

  // Data for the bar chart
  const categoryData = uniqueCategories.map((category) => ({
    name: category,
    count: incidents.filter((incident) => incident.category === category).length,
  }));

  // Data for the pie chart
  const sectorData = uniqueSectors.map((sector) => ({
    name: sector,
    value: incidents.filter((incident) => incident.target_sector === sector).length,
  }));

  // Data for severity distribution
  const severityData = [
    {
      name: "Critical",
      value: incidents.filter((incident) => incident.severity === "critical").length,
    },
    {
      name: "High",
      value: incidents.filter((incident) => incident.severity === "high").length,
    },
    {
      name: "Medium",
      value: incidents.filter((incident) => incident.severity === "medium").length,
    },
    {
      name: "Low",
      value: incidents.filter((incident) => incident.severity === "low").length,
    },
  ];

  const COLORS = ["#F44336", "#FF9800", "#FFC107", "#4CAF50"];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-cybergray-800 p-3 border border-cybergray-200 dark:border-cybergray-700 rounded shadow-md">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-cyberblue-500">
            Count: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="py-16 bg-cybergray-50 dark:bg-cyberdark" id="analysis">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-cybergray-900 dark:text-white mb-3">Threat Analysis</h2>
            <p className="text-cybergray-600 dark:text-cybergray-400 max-w-2xl mx-auto">
              Comprehensive analysis of cyber incidents across Indian cyberspace, categorized by type, sector, and severity level.
            </p>
          </div>

          <div className="cyber-card mb-8">
            <div className="flex border-b border-cybergray-200 dark:border-cybergray-800">
              <button
                className={`flex-1 py-3 px-4 text-center transition-colors ${
                  activeTab === "categories"
                    ? "text-cyberblue-500 border-b-2 border-cyberblue-500"
                    : "text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-500"
                }`}
                onClick={() => setActiveTab("categories")}
              >
                <div className="flex items-center justify-center gap-2">
                  <Shield size={18} />
                  <span>Incident Categories</span>
                </div>
              </button>
              <button
                className={`flex-1 py-3 px-4 text-center transition-colors ${
                  activeTab === "sectors"
                    ? "text-cyberblue-500 border-b-2 border-cyberblue-500"
                    : "text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-500"
                }`}
                onClick={() => setActiveTab("sectors")}
              >
                <div className="flex items-center justify-center gap-2">
                  <Activity size={18} />
                  <span>Target Sectors</span>
                </div>
              </button>
              <button
                className={`flex-1 py-3 px-4 text-center transition-colors ${
                  activeTab === "severity"
                    ? "text-cyberblue-500 border-b-2 border-cyberblue-500"
                    : "text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-500"
                }`}
                onClick={() => setActiveTab("severity")}
              >
                <div className="flex items-center justify-center gap-2">
                  <AlertTriangle size={18} />
                  <span>Severity Levels</span>
                </div>
              </button>
            </div>

            <div className="p-6">
              {activeTab === "categories" && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold text-cybergray-900 dark:text-white mb-6">
                    Incident Categories Distribution
                  </h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                        <XAxis dataKey="name" angle={-45} textAnchor="end" tick={{ fill: '#6C757D' }} />
                        <YAxis tick={{ fill: '#6C757D' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" fill="#007AFF" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6">
                    <p className="text-cybergray-600 dark:text-cybergray-400">
                      The chart above shows the distribution of incidents across different categories. 
                      This helps identify the most common types of cyber threats targeting Indian cyberspace.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "sectors" && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold text-cybergray-900 dark:text-white mb-6">
                    Target Sectors Distribution
                  </h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sectorData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {sectorData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 40}, 70%, 50%)`} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6">
                    <p className="text-cybergray-600 dark:text-cybergray-400">
                      This chart visualizes which sectors are most frequently targeted by cyber attacks. 
                      Understanding sector vulnerability helps in developing targeted protection strategies.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "severity" && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold text-cybergray-900 dark:text-white mb-6">
                    Incident Severity Distribution
                  </h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={severityData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {severityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6">
                    <p className="text-cybergray-600 dark:text-cybergray-400">
                      This chart shows the distribution of incidents by severity level. 
                      Identifying the proportion of high-severity incidents helps prioritize security resources.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="cyber-card p-6">
            <h3 className="text-xl font-semibold text-cybergray-900 dark:text-white mb-4">Key Insights</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="h-3 w-3 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-cybergray-700 dark:text-cybergray-300">
                  Financial and Government sectors are the most targeted, with higher rates of critical severity incidents.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-cybergray-700 dark:text-cybergray-300">
                  Phishing and API Security vulnerabilities represent the most common attack vectors across all sectors.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-cybergray-700 dark:text-cybergray-300">
                  Healthcare and Education sectors show improving response times, with faster incident resolution.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatAnalysis;
