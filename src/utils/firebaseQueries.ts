import { db } from "../integrations/firebase/config";
import { collection, getDocs, query, where, orderBy, doc, getDoc, Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { CyberIncident, PreventiveMeasure } from "../integrations/firebase/types";

export type { CyberIncident, PreventiveMeasure };

// Helper function to handle Firestore timestamps
const formatTimestamp = (timestamp: unknown): string => {
  if (!timestamp) return new Date().toISOString();
  
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  
  return new Date().toISOString();
};

export const fetchIncidents = async (): Promise<CyberIncident[]> => {
  try {
    const incidentsRef = collection(db, "cyber_incidents");
    const incidentsQuery = query(incidentsRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(incidentsQuery);
    
    const incidents: CyberIncident[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<CyberIncident, "id">;
      incidents.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        timestamp: formatTimestamp(data.timestamp),
        severity: data.severity as "low" | "medium" | "high" | "critical",
        status: data.status as "active" | "mitigated" | "investigating" | "resolved",
        category: data.category,
        target_sector: data.target_sector,
        created_at: formatTimestamp(data.created_at),
        // For backward compatibility with the mockData structure
        affected_systems: data.affected_systems || ["System A", "System B"], // Default placeholder values
        source: data.source || {
          name: "Unknown Source",
          type: data.category,
        },
        impactDetails: data.impactDetails || {
          operational: "Operational impact details not available",
        },
        preventiveMeasures: data.preventiveMeasures || []  // This will be populated separately
      });
    });
    
    console.log("Fetched incidents:", incidents.length);
    return incidents;
  } catch (error) {
    console.error("Error in fetchIncidents:", error);
    toast.error("Failed to load incident data");
    return [];
  }
};

export const fetchPreventiveMeasures = async (incidentId: string): Promise<PreventiveMeasure[]> => {
  try {
    const measuresRef = collection(db, "preventive_measures");
    const measuresQuery = query(measuresRef, where("incident_id", "==", incidentId));
    const querySnapshot = await getDocs(measuresQuery);
    
    const measures: PreventiveMeasure[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<PreventiveMeasure, "id">;
      measures.push({
        id: doc.id,
        incident_id: data.incident_id,
        title: data.title,
        description: data.description,
        priority: data.priority as "low" | "medium" | "high",
        created_at: formatTimestamp(data.created_at)
      });
    });
    
    console.log(`Fetched preventive measures for incident ${incidentId}:`, measures.length);
    return measures;
  } catch (error) {
    console.error("Error in fetchPreventiveMeasures:", error);
    toast.error("Failed to load preventive measures");
    return [];
  }
};

export const fetchIncidentById = async (incidentId: string): Promise<CyberIncident | null> => {
  try {
    const incidentRef = doc(db, "cyber_incidents", incidentId);
    const incidentDoc = await getDoc(incidentRef);
    
    if (!incidentDoc.exists()) {
      toast.error("Incident not found");
      return null;
    }
    
    const data = incidentDoc.data() as Omit<CyberIncident, "id">;
    
    return {
      id: incidentDoc.id,
      title: data.title,
      description: data.description,
      timestamp: formatTimestamp(data.timestamp),
      severity: data.severity as "low" | "medium" | "high" | "critical",
      status: data.status as "active" | "mitigated" | "investigating" | "resolved",
      category: data.category,
      target_sector: data.target_sector,
      created_at: formatTimestamp(data.created_at),
      affected_systems: data.affected_systems || ["System A", "System B"],
      source: data.source || {
        name: "Unknown Source",
        type: data.category,
      },
      impactDetails: data.impactDetails || {
        operational: "Operational impact details not available",
      },
      preventiveMeasures: data.preventiveMeasures || []
    };
  } catch (error) {
    console.error("Error in fetchIncidentById:", error);
    toast.error("Failed to load incident details");
    return null;
  }
};