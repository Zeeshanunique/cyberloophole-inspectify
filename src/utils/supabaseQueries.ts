// This file re-exports Firebase queries to maintain compatibility with components
// that were previously using Supabase

import { 
  fetchIncidents as firebaseFetchIncidents,
  fetchPreventiveMeasures as firebaseFetchPreventiveMeasures,
  fetchIncidentById as firebaseFetchIncidentById,
  CyberIncident,
  PreventiveMeasure
} from "./firebaseQueries";

// Re-export types
export type { CyberIncident, PreventiveMeasure };

// Re-export functions with the same names
export const fetchIncidents = firebaseFetchIncidents;
export const fetchPreventiveMeasures = firebaseFetchPreventiveMeasures;
export const fetchIncidentById = firebaseFetchIncidentById;