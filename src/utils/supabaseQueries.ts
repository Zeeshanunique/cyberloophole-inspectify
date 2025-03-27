
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CyberIncident {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "active" | "mitigated" | "investigating" | "resolved";
  category: string;
  target_sector: string;
  affected_systems?: string[];
  source?: {
    name: string;
    type: string;
    location?: string;
    motivation?: string;
  };
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
  created_at?: string;
}

export const fetchIncidents = async (): Promise<CyberIncident[]> => {
  try {
    const { data, error } = await supabase
      .from("cyber_incidents")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Error fetching incidents:", error);
      toast.error("Failed to load incident data");
      return [];
    }

    return data.map(incident => ({
      id: incident.id,
      title: incident.title,
      description: incident.description,
      timestamp: incident.timestamp,
      severity: incident.severity as "low" | "medium" | "high" | "critical",
      status: incident.status as "active" | "mitigated" | "investigating" | "resolved",
      category: incident.category,
      target_sector: incident.target_sector,
      // For backward compatibility with the mockData structure
      affected_systems: ["System A", "System B"], // Default placeholder values
      source: {
        name: "Unknown Source",
        type: incident.category,
      },
      impactDetails: {
        operational: "Operational impact details not available",
      },
      preventiveMeasures: []  // This will be populated separately
    }));
  } catch (error) {
    console.error("Error in fetchIncidents:", error);
    toast.error("Failed to load incident data");
    return [];
  }
};

export const fetchPreventiveMeasures = async (incidentId: string): Promise<PreventiveMeasure[]> => {
  try {
    const { data, error } = await supabase
      .from("preventive_measures")
      .select("*")
      .eq("incident_id", incidentId);

    if (error) {
      console.error("Error fetching preventive measures:", error);
      toast.error("Failed to load preventive measures");
      return [];
    }

    return data.map(measure => ({
      id: measure.id,
      incident_id: measure.incident_id,
      title: measure.title,
      description: measure.description,
      priority: measure.priority as "low" | "medium" | "high",
      created_at: measure.created_at
    }));
  } catch (error) {
    console.error("Error in fetchPreventiveMeasures:", error);
    toast.error("Failed to load preventive measures");
    return [];
  }
};
