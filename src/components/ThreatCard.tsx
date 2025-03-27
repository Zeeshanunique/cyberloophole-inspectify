
import { CyberIncident } from "../utils/supabaseQueries";
import { ChevronRight, AlertTriangle, Clock, Shield } from "lucide-react";
import { useState } from "react";

interface ThreatCardProps {
  incident: CyberIncident;
  onClick: () => void;
}

const ThreatCard = ({ incident, onClick }: ThreatCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
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
    <div
      className={`cyber-card card-hover cursor-pointer transform transition-all duration-300 ${
        isHovered ? "shadow-lg scale-[1.02]" : ""
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex space-x-2 items-center">
            <span className={`status-badge ${getSeverityColor(incident.severity)}`}>
              {incident.severity.toUpperCase()}
            </span>
            <span className="text-xs text-cybergray-500 flex items-center gap-1">
              <Clock size={12} />
              {formatDate(incident.timestamp)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`h-2 w-2 rounded-full ${getStatusColor(incident.status)}`}></div>
            <span className="text-xs text-cybergray-600 dark:text-cybergray-400 capitalize">
              {incident.status}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-2 text-cybergray-900 dark:text-white line-clamp-2">
          {incident.title}
        </h3>

        <p className="text-cybergray-600 dark:text-cybergray-300 mt-2 text-sm line-clamp-2">
          {incident.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2 py-1 bg-cybergray-100 dark:bg-cybergray-800 text-cybergray-800 dark:text-cybergray-200 rounded text-xs">
            {incident.category}
          </span>
          <span className="inline-flex items-center px-2 py-1 bg-cybergray-100 dark:bg-cybergray-800 text-cybergray-800 dark:text-cybergray-200 rounded text-xs">
            {incident.targetSector || incident.target_sector}
          </span>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center text-xs text-cybergray-500">
            <Shield size={14} className="mr-1" />
            <span>{incident.preventiveMeasures?.length || 0} Preventive measures</span>
          </div>
          <ChevronRight
            size={18}
            className={`text-cyberblue-500 transition-transform duration-300 ${
              isHovered ? "translate-x-1" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default ThreatCard;
