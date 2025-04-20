import { getFirestore, collection, addDoc, Timestamp, query, where, getDocs, Firestore } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL, FirebaseStorage } from 'firebase/storage';
// Import the app instance
import { app } from '../integrations/firebase/config';

// Types for our data
interface CollectedIncident {
  title: string;
  description: string;
  source: string;
  sourceUrl: string;
  date: Date;
  sector?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  attackVector?: string;
  threatActors?: string[];
  indicators?: string[];
  rawContent?: string;
  status: 'new' | 'verified' | 'false_positive';
}

interface SourceConfig {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'website' | 'twitter' | 'reddit' | 'github' | 'pastebin';
  selectors?: {
    container?: string;
    title?: string;
    content?: string;
    date?: string;
  };
  keywords: string[];
  enabled: boolean;
  lastScraped?: Date;
}

/**
 * Service for collecting cyber incident data from various sources
 */
class DataCollectionService {
  private static instance: DataCollectionService | null = null;
  private db: Firestore;
  private storage: FirebaseStorage;
  
  private constructor() {
    // Initialize Firestore and Storage with the app instance
    this.db = getFirestore(app);
    this.storage = getStorage(app);
  }

  /**
   * Get the singleton instance of DataCollectionService
   * Ensures Firebase is initialized before use
   */
  public static getInstance(): DataCollectionService {
    if (!DataCollectionService.instance) {
      DataCollectionService.instance = new DataCollectionService();
    }
    return DataCollectionService.instance;
  }
  
  /**
   * Get all configured data sources
   */
  async getSources(): Promise<SourceConfig[]> {
    try {
      const sourcesRef = collection(this.db, 'dataSources');
      const sourcesSnapshot = await getDocs(sourcesRef);
      
      const sources: SourceConfig[] = [];
      sourcesSnapshot.forEach(doc => {
        sources.push({ id: doc.id, ...doc.data() } as SourceConfig);
      });
      
      return sources;
    } catch (error) {
      console.error('Error getting data sources:', error);
      throw error;
    }
  }
  
  /**
   * Add a new data source
   */
  async addSource(source: Omit<SourceConfig, 'id'>): Promise<string> {
    try {
      const sourcesRef = collection(this.db, 'dataSources');
      const docRef = await addDoc(sourcesRef, {
        ...source,
        lastScraped: null
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding data source:', error);
      throw error;
    }
  }
  
  /**
   * Save a collected incident to the database
   */
  async saveIncident(incident: CollectedIncident): Promise<string> {
    try {
      // Check if this incident already exists (based on title and source)
      const incidentsRef = collection(this.db, 'incidents');
      const existingQuery = query(
        incidentsRef,
        where('title', '==', incident.title),
        where('source', '==', incident.source)
      );
      
      const existingSnapshot = await getDocs(existingQuery);
      if (!existingSnapshot.empty) {
        console.log('Incident already exists, skipping:', incident.title);
        return existingSnapshot.docs[0].id;
      }
      
      // Store raw content in Firebase Storage if it exists
      let rawContentUrl = null;
      if (incident.rawContent) {
        const contentRef = ref(this.storage, `raw_content/${Date.now()}_${incident.source.replace(/[^a-z0-9]/gi, '_')}.txt`);
        await uploadString(contentRef, incident.rawContent);
        rawContentUrl = await getDownloadURL(contentRef);
      }
      
      // Add the incident to Firestore
      const docRef = await addDoc(incidentsRef, {
        ...incident,
        date: Timestamp.fromDate(incident.date),
        rawContent: rawContentUrl, // Replace raw content with URL
        collectedAt: Timestamp.now(),
        processed: false
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error saving incident:', error);
      throw error;
    }
  }
  
  /**
   * Analyze text to determine sector, severity, and other metadata
   * This is a simple implementation - in a real system, this would use ML models
   */
  analyzeIncidentText(title: string, description: string): {
    sector: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    attackVector?: string;
  } {
    // Simple keyword-based classification
    const text = `${title} ${description}`.toLowerCase();
    
    // Determine sector
    let sector = 'Unknown';
    if (text.includes('bank') || text.includes('finance') || text.includes('payment')) {
      sector = 'Banking & Finance';
    } else if (text.includes('power') || text.includes('electricity') || text.includes('grid')) {
      sector = 'Power & Energy';
    } else if (text.includes('hospital') || text.includes('healthcare') || text.includes('medical')) {
      sector = 'Healthcare';
    } else if (text.includes('transport') || text.includes('railway') || text.includes('airport')) {
      sector = 'Transportation';
    } else if (text.includes('government') || text.includes('ministry') || text.includes('department')) {
      sector = 'Government';
    } else if (text.includes('telecom') || text.includes('communication') || text.includes('network')) {
      sector = 'Telecommunications';
    }
    
    // Determine severity
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    if (text.includes('critical') || text.includes('severe') || text.includes('breach') || text.includes('leak')) {
      severity = 'critical';
    } else if (text.includes('high') || text.includes('major') || text.includes('significant')) {
      severity = 'high';
    } else if (text.includes('low') || text.includes('minor') || text.includes('small')) {
      severity = 'low';
    }
    
    // Determine attack vector
    let attackVector;
    if (text.includes('phishing')) {
      attackVector = 'Phishing';
    } else if (text.includes('ransomware')) {
      attackVector = 'Ransomware';
    } else if (text.includes('ddos') || text.includes('denial of service')) {
      attackVector = 'DDoS';
    } else if (text.includes('sql injection') || text.includes('sqli')) {
      attackVector = 'SQL Injection';
    } else if (text.includes('xss') || text.includes('cross site')) {
      attackVector = 'Cross-Site Scripting';
    }
    
    return {
      sector,
      severity,
      attackVector
    };
  }
  
  /**
   * Extract potential indicators of compromise from text
   */
  extractIOCs(text: string): string[] {
    const iocs: string[] = [];
    
    // Extract IP addresses
    const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
    const ips = text.match(ipRegex) || [];
    iocs.push(...ips);
    
    // Extract domains
    const domainRegex = /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\b/g;
    const domains = text.match(domainRegex) || [];
    iocs.push(...domains);
    
    // Extract hashes (MD5, SHA1, SHA256)
    const md5Regex = /\b[a-f0-9]{32}\b/gi;
    const sha1Regex = /\b[a-f0-9]{40}\b/gi;
    const sha256Regex = /\b[a-f0-9]{64}\b/gi;
    
    const md5s = text.match(md5Regex) || [];
    const sha1s = text.match(sha1Regex) || [];
    const sha256s = text.match(sha256Regex) || [];
    
    iocs.push(...md5s, ...sha1s, ...sha256s);
    
    // Remove duplicates
    return [...new Set(iocs)];
  }
  
  /**
   * Process an RSS feed
   * This is a placeholder - in a real implementation, you would use a proper RSS parser
   */
  async processRSSFeed(source: SourceConfig): Promise<CollectedIncident[]> {
    try {
      // In a real implementation, you would:
      // 1. Fetch the RSS feed
      // 2. Parse the XML
      // 3. Extract items
      // 4. Filter by keywords
      // 5. Transform to CollectedIncident format
      
      console.log(`Processing RSS feed: ${source.name}`);
      
      // This is just a placeholder
      return [];
    } catch (error) {
      console.error(`Error processing RSS feed ${source.name}:`, error);
      return [];
    }
  }
  
  /**
   * Process a website
   * This is a placeholder - in a real implementation, you would use a web scraper
   */
  async processWebsite(source: SourceConfig): Promise<CollectedIncident[]> {
    try {
      // In a real implementation, you would:
      // 1. Fetch the website HTML
      // 2. Parse the HTML
      // 3. Extract content using selectors
      // 4. Filter by keywords
      // 5. Transform to CollectedIncident format
      
      console.log(`Processing website: ${source.name}`);
      
      // This is just a placeholder
      return [];
    } catch (error) {
      console.error(`Error processing website ${source.name}:`, error);
      return [];
    }
  }
  
  /**
   * Run the data collection process for all enabled sources
   */
  async runCollection(): Promise<{ total: number; new: number; errors: number }> {
    try {
      const sources = await this.getSources();
      const enabledSources = sources.filter(source => source.enabled);
      
      let totalIncidents = 0;
      let newIncidents = 0;
      let errors = 0;
      
      for (const source of enabledSources) {
        try {
          let incidents: CollectedIncident[] = [];
          
          // Process based on source type
          switch (source.type) {
            case 'rss':
              incidents = await this.processRSSFeed(source);
              break;
            case 'website':
              incidents = await this.processWebsite(source);
              break;
            // Add other source types as needed
            default:
              console.log(`Unsupported source type: ${source.type}`);
          }
          
          // Save each incident
          for (const incident of incidents) {
            try {
              // Analyze and enrich the incident
              const analysis = this.analyzeIncidentText(incident.title, incident.description);
              const indicators = this.extractIOCs(incident.description + (incident.rawContent || ''));
              
              const enrichedIncident: CollectedIncident = {
                ...incident,
                sector: incident.sector || analysis.sector,
                severity: incident.severity || analysis.severity,
                attackVector: incident.attackVector || analysis.attackVector,
                indicators: [...new Set([...(incident.indicators || []), ...indicators])]
              };
              
              // Save to database
              await this.saveIncident(enrichedIncident);
              newIncidents++;
            } catch (error) {
              console.error('Error processing incident:', error);
              errors++;
            }
          }
          
          totalIncidents += incidents.length;
          
        } catch (error) {
          console.error(`Error processing source ${source.name}:`, error);
          errors++;
        }
      }
      
      return { total: totalIncidents, new: newIncidents, errors };
    } catch (error) {
      console.error('Error running collection:', error);
      throw error;
    }
  }
}

export const dataCollectionService = DataCollectionService.getInstance();