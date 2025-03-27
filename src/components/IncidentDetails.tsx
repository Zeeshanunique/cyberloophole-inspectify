import { useState, useEffect } from "react";
import { X, AlertTriangle, User, Shield, ExternalLink, Clock, Target, Server, FileText } from "lucide-react";
import { CyberIncident } from "../utils/supabaseQueries";
import PreventiveActions from "./PreventiveActions";
import { fetchPreventiveMeasures } from "../utils/supabaseQueries";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface IncidentDetailsProps {
  incident: CyberIncident;
  onClose: () => void;
}

const IncidentDetails = ({ incident, onClose }: IncidentDetailsProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch preventive measures for this incident
  const { data: preventiveMeasures = [], isLoading } = useQuery({
    queryKey: ['preventiveMeasures', incident.id],
    queryFn: () => fetchPreventiveMeasures(incident.id),
  });

  // Enhance the incident with preventive measures once loaded
  useEffect(() => {
    if (preventiveMeasures.length > 0 && incident.preventiveMeasures) {
      incident.preventiveMeasures = preventiveMeasures.map(measure => measure.title);
    }
  }, [preventiveMeasures, incident]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "status-badge-low";
      case "medium":
        return "status-badge-medium";
      case "high":
        return "status-badge-high";
      case "critical":
        return "status-badge-critical";
      default:
        return "status-badge-low";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-500";
      case "mitigated":
        return "bg-yellow-500";
      case "investigating":
        return "bg-blue-500";
      case "resolved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto">
      <div 
        className="bg-white dark:bg-cyberdark border border-cybergray-200 dark:border-cybergray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-cyberdark z-10 border-b border-cybergray-200 dark:border-cybergray-800 flex justify-between items-center p-4">
          <div className="flex space-x-2 items-center">
            <span className={`status-badge ${getSeverityColor(incident.severity)}`}>
              {incident.severity.toUpperCase()}
            </span>
            <h2 className="text-xl font-semibold text-cybergray-900 dark:text-white">{incident.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-cybergray-100 dark:hover:bg-cybergray-800 transition-colors"
          >
            <X className="h-5 w-5 text-cybergray-500 dark:text-cybergray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-1.5 text-sm">
              <Clock className="h-4 w-4 text-cybergray-500" />
              <span className="text-cybergray-700 dark:text-cybergray-300">{formatDate(incident.timestamp)}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-sm">
              <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(incident.status)}`}></div>
              <span className="text-cybergray-700 dark:text-cybergray-300 capitalize">{incident.status}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-sm">
              <Target className="h-4 w-4 text-cybergray-500" />
              <span className="text-cybergray-700 dark:text-cybergray-300">{incident.target_sector}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-sm">
              <FileText className="h-4 w-4 text-cybergray-500" />
              <span className="text-cybergray-700 dark:text-cybergray-300">{incident.category}</span>
            </div>
          </div>

          <div className="flex border-b border-cybergray-200 dark:border-cybergray-800 mb-6">
            <button
              className={`py-2 px-4 text-center transition-colors ${
                activeTab === "overview"
                  ? "text-cyberblue-500 border-b-2 border-cyberblue-500"
                  : "text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-500"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`py-2 px-4 text-center transition-colors ${
                activeTab === "threat"
                  ? "text-cyberblue-500 border-b-2 border-cyberblue-500"
                  : "text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-500"
              }`}
              onClick={() => setActiveTab("threat")}
            >
              Threat Source
            </button>
            <button
              className={`py-2 px-4 text-center transition-colors ${
                activeTab === "impact"
                  ? "text-cyberblue-500 border-b-2 border-cyberblue-500"
                  : "text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-500"
              }`}
              onClick={() => setActiveTab("impact")}
            >
              Impact Analysis
            </button>
            <button
              className={`py-2 px-4 text-center transition-colors ${
                activeTab === "prevention"
                  ? "text-cyberblue-500 border-b-2 border-cyberblue-500"
                  : "text-cybergray-600 dark:text-cybergray-400 hover:text-cyberblue-500 dark:hover:text-cyberblue-500"
              }`}
              onClick={() => setActiveTab("prevention")}
            >
              Prevention
            </button>
          </div>

          {activeTab === "overview" && (
            <div className="animate-fade-in">
              <p className="text-cybergray-700 dark:text-cybergray-300 mb-6">
                {incident.description}
              </p>

              <h3 className="text-lg font-medium text-cybergray-900 dark:text-white mb-3">Affected Systems</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {incident.affected_systems && incident.affected_systems.map((system, index) => (
                  <div
                    key={index}
                    className="px-3 py-1.5 bg-cybergray-100 dark:bg-cybergray-800 text-cybergray-800 dark:text-cybergray-200 rounded-md text-sm flex items-center"
                  >
                    <Server className="h-3.5 w-3.5 mr-1.5" />
                    {system}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-cybergray-900 dark:text-white mb-3">Threat Source</h3>
                  <div className="bg-cybergray-50 dark:bg-cybergray-900/50 rounded-lg p-4">
                    <div className="flex items-start mb-2">
                      <User className="h-4 w-4 text-cybergray-500 mt-0.5 mr-2" />
                      <div>
                        <span className="block text-sm text-cybergray-500 dark:text-cybergray-400">Name</span>
                        <span className="text-cybergray-900 dark:text-white">{incident.source?.name}</span>
                      </div>
                    </div>
                    <div className="flex items-start mb-2">
                      <AlertTriangle className="h-4 w-4 text-cybergray-500 mt-0.5 mr-2" />
                      <div>
                        <span className="block text-sm text-cybergray-500 dark:text-cybergray-400">Type</span>
                        <span className="text-cybergray-900 dark:text-white">{incident.source?.type}</span>
                      </div>
                    </div>
                    {incident.source?.location && (
                      <div className="flex items-start">
                        <Target className="h-4 w-4 text-cybergray-500 mt-0.5 mr-2" />
                        <div>
                          <span className="block text-sm text-cybergray-500 dark:text-cybergray-400">Location</span>
                          <span className="text-cybergray-900 dark:text-white">{incident.source?.location}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-cybergray-900 dark:text-white mb-3">Key Impact Areas</h3>
                  <div className="bg-cybergray-50 dark:bg-cybergray-900/50 rounded-lg p-4">
                    {incident.impactDetails.financial && (
                      <div className="mb-2">
                        <span className="block text-sm text-cybergray-500 dark:text-cybergray-400">Financial Impact</span>
                        <span className="text-cybergray-900 dark:text-white">{incident.impactDetails.financial}</span>
                      </div>
                    )}
                    {incident.impactDetails.operational && (
                      <div className="mb-2">
                        <span className="block text-sm text-cybergray-500 dark:text-cybergray-400">Operational Impact</span>
                        <span className="text-cybergray-900 dark:text-white">{incident.impactDetails.operational}</span>
                      </div>
                    )}
                    {incident.impactDetails.dataLoss && (
                      <div>
                        <span className="block text-sm text-cybergray-500 dark:text-cybergray-400">Data Loss</span>
                        <span className="text-cybergray-900 dark:text-white">{incident.impactDetails.dataLoss}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "threat" && (
            <div className="animate-fade-in">
              <div className="bg-cybergray-50 dark:bg-cybergray-900/50 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-cybergray-900 dark:text-white">{incident.source?.name}</h3>
                    <p className="text-cybergray-600 dark:text-cybergray-400">{incident.source?.type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {incident.source?.location && (
                    <div>
                      <h4 className="text-sm font-medium text-cybergray-500 dark:text-cybergray-400 uppercase mb-1">Location</h4>
                      <p className="text-cybergray-900 dark:text-white">{incident.source?.location}</p>
                    </div>
                  )}
                  {incident.source?.motivation && (
                    <div>
                      <h4 className="text-sm font-medium text-cybergray-500 dark:text-cybergray-400 uppercase mb-1">Motivation</h4>
                      <p className="text-cybergray-900 dark:text-white">{incident.source?.motivation}</p>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-medium text-cybergray-900 dark:text-white mb-3">Threat Analysis</h3>
              <div className="prose prose-cybergray dark:prose-invert max-w-none">
                <p>
                  Based on the incident details and known threat intelligence, this incident is attributed to {" "}
                  <strong>{incident.source?.name}</strong>, a {incident.source?.type?.toLowerCase()} actor 
                  {incident.source?.location ? ` operating from ${incident.source.location}` : ""}.
                </p>
                
                <p>
                  {incident.source?.type === "Group" && "This group has been active in targeting Indian organizations, with a focus on the " + incident.target_sector + " sector."}
                  {incident.source?.type === "Individual" && "This individual threat actor has been targeting vulnerabilities in " + incident.target_sector + " sector infrastructure."}
                  {incident.source?.type === "Nation-state" && "This nation-state actor has a history of sophisticated campaigns targeting critical infrastructure in the " + incident.target_sector + " sector."}
                </p>
                
                {incident.source?.motivation && (
                  <p>
                    Their primary motivation appears to be <strong>{incident.source?.motivation.toLowerCase()}</strong>, 
                    consistent with previous campaigns and the nature of the current attack.
                  </p>
                )}
                
                <p>
                  The attack methodology is characteristic of their known tactics, techniques, and procedures (TTPs), 
                  including the exploitation of {incident.category.toLowerCase()} vulnerabilities.
                </p>
              </div>
            </div>
          )}

          {activeTab === "impact" && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {incident.impactDetails.financial && (
                  <div className="cyber-card p-4">
                    <h3 className="text-lg font-medium text-cybergray-900 dark:text-white mb-2">Financial Impact</h3>
                    <p className="text-cybergray-700 dark:text-cybergray-300">{incident.impactDetails.financial}</p>
                  </div>
                )}
                
                {incident.impactDetails.operational && (
                  <div className="cyber-card p-4">
                    <h3 className="text-lg font-medium text-cybergray-900 dark:text-white mb-2">Operational Impact</h3>
                    <p className="text-cybergray-700 dark:text-cybergray-300">{incident.impactDetails.operational}</p>
                  </div>
                )}
                
                {incident.impactDetails.reputational && (
                  <div className="cyber-card p-4">
                    <h3 className="text-lg font-medium text-cybergray-900 dark:text-white mb-2">Reputational Impact</h3>
                    <p className="text-cybergray-700 dark:text-cybergray-300">{incident.impactDetails.reputational}</p>
                  </div>
                )}
                
                {incident.impactDetails.dataLoss && (
                  <div className="cyber-card p-4">
                    <h3 className="text-lg font-medium text-cybergray-900 dark:text-white mb-2">Data Loss</h3>
                    <p className="text-cybergray-700 dark:text-cybergray-300">{incident.impactDetails.dataLoss}</p>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-medium text-cybergray-900 dark:text-white mb-3">Impact Analysis</h3>
              <div className="prose prose-cybergray dark:prose-invert max-w-none">
                <p>
                  This incident targeting the <strong>{incident.target_sector}</strong> sector through {incident.category.toLowerCase()} 
                  has resulted in significant impacts across multiple dimensions.
                </p>

                {incident.impactDetails.financial && (
                  <p>
                    The financial implications are substantial, with {incident.impactDetails.financial.toLowerCase()}. 
                    This represents a significant cost that may affect operational budgets and investor confidence.
                  </p>
                )}

                {incident.impactDetails.operational && (
                  <p>
                    From an operational perspective, the incident has caused {incident.impactDetails.operational.toLowerCase()}, 
                    affecting business continuity and service delivery to customers and stakeholders.
                  </p>
                )}

                {incident.impactDetails.reputational && (
                  <p>
                    The reputational damage includes {incident.impactDetails.reputational.toLowerCase()}, 
                    which may have long-term consequences for customer trust and market position.
                  </p>
                )}

                {incident.impactDetails.dataLoss && (
                  <p>
                    Most critically, the data loss aspect involves {incident.impactDetails.dataLoss.toLowerCase()}, 
                    which raises significant privacy concerns and potential regulatory implications.
                  </p>
                )}

                <p>
                  The affected systems include {incident.affected_systems && incident.affected_systems.join(", ")}, 
                  suggesting a moderately broad impact on the organization's technology infrastructure.
                </p>
                
                <p>
                  Overall, this incident represents a {incident.severity} severity event requiring 
                  {incident.status === "resolved" 
                    ? " comprehensive review of security measures to prevent recurrence." 
                    : " immediate attention and resources to mitigate ongoing damage and prevent escalation."}
                </p>
              </div>
            </div>
          )}

          {activeTab === "prevention" && (
            <PreventiveActions incident={incident} />
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;
