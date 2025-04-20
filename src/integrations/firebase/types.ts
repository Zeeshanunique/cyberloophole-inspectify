// Firebase data types for the application

export interface ThreatSource {
  name: string;
  type: string;
  location?: string;
  motivation?: string;
}

export interface CyberIncident {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "active" | "mitigated" | "investigating" | "resolved";
  category: string;
  target_sector: string;
  created_at: string;
  affected_systems?: string[];
  source?: ThreatSource;
  impactDetails?: {
    financial?: string;
    operational?: string;
    reputational?: string;
    dataLoss?: string;
  };
  preventiveMeasures?: string[];
}

export interface PreventiveMeasure {
  id: string;
  incident_id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  created_at: string;
}