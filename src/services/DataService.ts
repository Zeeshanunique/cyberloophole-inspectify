import { app } from '../integrations/firebase/config';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  Timestamp, 
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore';
import { toast } from '@/components/ui/use-toast';

// Firestore database instance
const db = getFirestore(app);

// Base incident type
export interface BaseIncident {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  sector: string;
  source: string;
  sourceUrl?: string;
  attackVector?: string;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  indicators?: string[];
  affectedSystems?: string[];
  threatActors?: {
    name: string;
    confidence: number;
    attributes?: {
      motivation?: string;
      sophistication?: string;
      country?: string;
    };
  }[];
}

// Incident with ID
export interface Incident extends BaseIncident {
  id: string;
  date: Timestamp;
  collectedAt: Timestamp;
  processed: boolean;
}

// Incident statistics
export interface IncidentStatistics {
  totalIncidents: number;
  criticalIncidents: number;
  highIncidents: number;
  sectorsAffected: number;
  openIncidents: number;
  incidentsBySector: Record<string, number>;
  incidentsBySeverity: Record<string, number>;
  incidentsByAttackVector: Record<string, number>;
}

// Recent trend data point
export interface TrendDataPoint {
  date: string;
  count: number;
}

class DataService {
  private static instance: DataService | null = null;

  // Singleton pattern
  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private constructor() {
    // Private constructor to enforce singleton
  }

  // Get collection reference
  private getCollectionRef(collectionName: string) {
    return collection(db, collectionName);
  }

  // Get document reference
  private getDocRef(collectionName: string, docId: string) {
    return doc(db, collectionName, docId);
  }

  // Add a new incident
  async addIncident(incident: BaseIncident): Promise<string> {
    try {
      const incidentsRef = this.getCollectionRef('incidents');
      
      // Prepare incident data with timestamps
      const incidentWithTimestamps = {
        ...incident,
        date: Timestamp.now(),
        collectedAt: Timestamp.now(),
        processed: true
      };
      
      // Add to Firestore
      const docRef = await addDoc(incidentsRef, incidentWithTimestamps);
      
      toast({
        title: 'Success',
        description: `Incident "${incident.title}" was added successfully.`,
        variant: 'default',
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding incident:', error);
      
      toast({
        title: 'Error',
        description: `Failed to add incident: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
      
      throw error;
    }
  }

  // Get a single incident by ID
  async getIncident(id: string): Promise<Incident | null> {
    try {
      const docRef = this.getDocRef('incidents', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Incident;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting incident:', error);
      throw error;
    }
  }

  // Get recent incidents with pagination
  async getRecentIncidents(limitCount: number = 5, lastDoc?: DocumentSnapshot): Promise<{
    incidents: Incident[];
    lastDoc: DocumentSnapshot | null;
  }> {
    try {
      const incidentsRef = this.getCollectionRef('incidents');
      let recentQuery = query(
        incidentsRef,
        orderBy('date', 'desc'),
        limit(limitCount)
      );
      
      // Apply pagination if last document is provided
      if (lastDoc) {
        recentQuery = query(
          incidentsRef,
          orderBy('date', 'desc'),
          startAfter(lastDoc),
          limit(limitCount)
        );
      }
      
      const incidentsSnapshot = await getDocs(recentQuery);
      const incidents: Incident[] = [];
      
      incidentsSnapshot.forEach(doc => {
        incidents.push({ id: doc.id, ...doc.data() } as Incident);
      });
      
      // Return the incidents and the last document for pagination
      return {
        incidents,
        lastDoc: incidentsSnapshot.docs.length > 0 ? incidentsSnapshot.docs[incidentsSnapshot.docs.length - 1] : null
      };
    } catch (error) {
      console.error('Error getting recent incidents:', error);
      throw error;
    }
  }

  // Get all incidents
  async getAllIncidents(): Promise<Incident[]> {
    try {
      const incidentsRef = this.getCollectionRef('incidents');
      const incidentsQuery = query(incidentsRef, orderBy('date', 'desc'));
      const incidentsSnapshot = await getDocs(incidentsQuery);
      
      const incidents: Incident[] = [];
      
      incidentsSnapshot.forEach(doc => {
        incidents.push({ id: doc.id, ...doc.data() } as Incident);
      });
      
      return incidents;
    } catch (error) {
      console.error('Error getting all incidents:', error);
      throw error;
    }
  }

  // Update an incident
  async updateIncident(id: string, incidentData: Partial<BaseIncident>): Promise<void> {
    try {
      const docRef = this.getDocRef('incidents', id);
      
      await updateDoc(docRef, incidentData);
      
      toast({
        title: 'Success',
        description: 'Incident was updated successfully.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error updating incident:', error);
      
      toast({
        title: 'Error',
        description: `Failed to update incident: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
      
      throw error;
    }
  }

  // Delete an incident
  async deleteIncident(id: string): Promise<void> {
    try {
      const docRef = this.getDocRef('incidents', id);
      
      await deleteDoc(docRef);
      
      toast({
        title: 'Success',
        description: 'Incident was deleted successfully.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deleting incident:', error);
      
      toast({
        title: 'Error',
        description: `Failed to delete incident: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
      
      throw error;
    }
  }

  // Get incident statistics
  async getIncidentStatistics(): Promise<IncidentStatistics> {
    try {
      const incidentsRef = this.getCollectionRef('incidents');
      const incidentsQuery = query(incidentsRef);
      const incidentsSnapshot = await getDocs(incidentsQuery);
      
      const sectorMap: Record<string, number> = {};
      const severityMap: Record<string, number> = {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      };
      const attackVectorMap: Record<string, number> = {};
      let openIncidents = 0;
      
      incidentsSnapshot.forEach(doc => {
        const data = doc.data() as Incident;
        
        // Count by sector
        if (data.sector) {
          sectorMap[data.sector] = (sectorMap[data.sector] || 0) + 1;
        }
        
        // Count by severity
        if (data.severity && severityMap.hasOwnProperty(data.severity)) {
          severityMap[data.severity]++;
        }
        
        // Count by attack vector
        if (data.attackVector) {
          attackVectorMap[data.attackVector] = (attackVectorMap[data.attackVector] || 0) + 1;
        }
        
        // Count open incidents
        if (data.status === 'new' || data.status === 'investigating') {
          openIncidents++;
        }
      });
      
      return {
        totalIncidents: incidentsSnapshot.size,
        criticalIncidents: severityMap.critical || 0,
        highIncidents: severityMap.high || 0,
        sectorsAffected: Object.keys(sectorMap).length,
        openIncidents: openIncidents,
        incidentsBySector: sectorMap,
        incidentsBySeverity: severityMap,
        incidentsByAttackVector: attackVectorMap
      };
    } catch (error) {
      console.error('Error getting incident statistics:', error);
      throw error;
    }
  }

  // Get incident trend data (for charts)
  async getIncidentTrend(days: number = 7): Promise<TrendDataPoint[]> {
    try {
      const incidentsRef = this.getCollectionRef('incidents');
      const trend: TrendDataPoint[] = [];
      const now = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
        
        const dailyQuery = query(
          incidentsRef,
          where('date', '>=', Timestamp.fromDate(startOfDay)),
          where('date', '<=', Timestamp.fromDate(endOfDay))
        );
        
        const dailySnapshot = await getDocs(dailyQuery);
        
        trend.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          count: dailySnapshot.size
        });
      }
      
      return trend;
    } catch (error) {
      console.error('Error getting incident trend:', error);
      throw error;
    }
  }

  // Get all unique sectors
  async getAllSectors(): Promise<string[]> {
    try {
      const incidents = await this.getAllIncidents();
      const sectorsSet = new Set<string>();
      
      incidents.forEach(incident => {
        if (incident.sector) {
          sectorsSet.add(incident.sector);
        }
      });
      
      return Array.from(sectorsSet).sort();
    } catch (error) {
      console.error('Error getting sectors:', error);
      throw error;
    }
  }

  // Search incidents
  async searchIncidents(
    searchTerm?: string,
    sector?: string,
    severity?: string,
    status?: string
  ): Promise<Incident[]> {
    try {
      // Get all incidents first
      const incidents = await this.getAllIncidents();
      
      // Apply filters
      return incidents.filter(incident => {
        // Search term filter
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchesSearch = 
            incident.title.toLowerCase().includes(term) || 
            incident.description.toLowerCase().includes(term) ||
            (incident.attackVector && incident.attackVector.toLowerCase().includes(term));
          
          if (!matchesSearch) return false;
        }
        
        // Sector filter
        if (sector && sector !== 'all' && incident.sector !== sector) {
          return false;
        }
        
        // Severity filter
        if (severity && severity !== 'all' && incident.severity !== severity) {
          return false;
        }
        
        // Status filter
        if (status && status !== 'all' && incident.status !== status) {
          return false;
        }
        
        return true;
      });
    } catch (error) {
      console.error('Error searching incidents:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const dataService = DataService.getInstance();
export default dataService; 