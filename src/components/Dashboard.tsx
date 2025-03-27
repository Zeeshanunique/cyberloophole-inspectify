
import { useState, useEffect } from "react";
import { AlertTriangle, Zap, Shield, Search, Eye, Filter } from "lucide-react";
import SearchBar from "./SearchBar";
import ThreatCard from "./ThreatCard";
import { incidentCategories, targetSectors, severityLevels } from "../utils/mockData";
import IncidentDetails from "./IncidentDetails";
import { fetchIncidents, CyberIncident } from "../utils/supabaseQueries";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredIncidents, setFilteredIncidents] = useState<CyberIncident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<CyberIncident | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    sector: "",
    severity: "",
  });

  // Fetch incidents using React Query
  const { data: incidents = [], isLoading, error } = useQuery({
    queryKey: ['incidents'],
    queryFn: fetchIncidents,
  });

  useEffect(() => {
    if (incidents) {
      // Apply filters
      let results = [...incidents];

      if (searchQuery) {
        results = results.filter((incident) =>
          incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          incident.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          incident.targetSector.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (filters.category) {
        results = results.filter((incident) => incident.category === filters.category);
      }

      if (filters.sector) {
        results = results.filter((incident) => incident.targetSector === filters.sector);
      }

      if (filters.severity) {
        results = results.filter((incident) => incident.severity === filters.severity);
      }

      setFilteredIncidents(results);
    }
  }, [searchQuery, filters, incidents]);

  // Stats
  const criticalIncidents = incidents.filter((i) => i.severity === "critical").length;
  const activeIncidents = incidents.filter((i) => i.status === "active").length;
  const resolvedIncidents = incidents.filter((i) => i.status === "resolved").length;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      sector: "",
      severity: "",
    });
  };

  const openIncidentDetails = (incident: CyberIncident) => {
    setSelectedIncident(incident);
    setShowDetailsModal(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="pt-24 pb-16" id="dashboard">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-80" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-12 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pt-24 pb-16" id="dashboard">
        <div className="container mx-auto px-4 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error Loading Data</h2>
          <p className="text-cybergray-600 dark:text-cybergray-400 mb-4">
            There was a problem loading the incident data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16" id="dashboard">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-cybergray-900 dark:text-white">Cyber Incident Dashboard</h2>
            <p className="text-cybergray-600 dark:text-cybergray-400 mt-2">
              Real-time monitoring of cyber threats in Indian cyberspace
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-cybergray-800 border border-cybergray-200 dark:border-cybergray-700 rounded-lg text-cybergray-800 dark:text-white hover:border-cyberblue-500 dark:hover:border-cyberblue-500 transition-colors"
            >
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="cyber-card p-6 flex items-center">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mr-4">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-cybergray-600 dark:text-cybergray-400 text-sm">Critical Incidents</p>
              <h3 className="text-2xl font-bold text-cybergray-900 dark:text-white">{criticalIncidents}</h3>
            </div>
          </div>

          <div className="cyber-card p-6 flex items-center">
            <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mr-4">
              <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-cybergray-600 dark:text-cybergray-400 text-sm">Active Threats</p>
              <h3 className="text-2xl font-bold text-cybergray-900 dark:text-white">{activeIncidents}</h3>
            </div>
          </div>

          <div className="cyber-card p-6 flex items-center">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mr-4">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-cybergray-600 dark:text-cybergray-400 text-sm">Resolved</p>
              <h3 className="text-2xl font-bold text-cybergray-900 dark:text-white">{resolvedIncidents}</h3>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} placeholder="Search incidents by title, description, category..." />
        </div>

        {filterOpen && (
          <div className="cyber-card p-4 mb-8 animate-slide-down">
            <h3 className="text-lg font-medium text-cybergray-900 dark:text-white mb-4">Filter Incidents</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-cybergray-600 dark:text-cybergray-400 mb-1">Category</label>
                <select
                  className="w-full bg-white dark:bg-cybergray-800 border border-cybergray-200 dark:border-cybergray-700 rounded-lg px-3 py-2 text-cybergray-800 dark:text-white"
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                >
                  <option value="">All Categories</option>
                  {incidentCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-cybergray-600 dark:text-cybergray-400 mb-1">Sector</label>
                <select
                  className="w-full bg-white dark:bg-cybergray-800 border border-cybergray-200 dark:border-cybergray-700 rounded-lg px-3 py-2 text-cybergray-800 dark:text-white"
                  value={filters.sector}
                  onChange={(e) => handleFilterChange("sector", e.target.value)}
                >
                  <option value="">All Sectors</option>
                  {targetSectors.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-cybergray-600 dark:text-cybergray-400 mb-1">Severity</label>
                <select
                  className="w-full bg-white dark:bg-cybergray-800 border border-cybergray-200 dark:border-cybergray-700 rounded-lg px-3 py-2 text-cybergray-800 dark:text-white"
                  value={filters.severity}
                  onChange={(e) => handleFilterChange("severity", e.target.value)}
                >
                  <option value="">All Severities</option>
                  {severityLevels.map((level) => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 border border-cybergray-200 dark:border-cybergray-700 rounded-lg text-cybergray-600 dark:text-cybergray-400 hover:bg-cybergray-100 dark:hover:bg-cybergray-800 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-cybergray-900 dark:text-white">Latest Incidents</h3>
          <span className="text-sm text-cybergray-600 dark:text-cybergray-400">
            Showing {filteredIncidents.length} incidents
          </span>
        </div>

        {filteredIncidents.length === 0 ? (
          <div className="cyber-card p-8 text-center">
            <Search className="h-12 w-12 mx-auto text-cybergray-400" />
            <h3 className="text-xl font-medium text-cybergray-900 dark:text-white mt-4">No incidents found</h3>
            <p className="text-cybergray-600 dark:text-cybergray-400 mt-2">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIncidents.map((incident) => (
              <ThreatCard
                key={incident.id}
                incident={incident}
                onClick={() => openIncidentDetails(incident)}
              />
            ))}
          </div>
        )}
      </div>

      {showDetailsModal && selectedIncident && (
        <IncidentDetails
          incident={selectedIncident}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
