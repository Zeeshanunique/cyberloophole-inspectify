import { getFirestore, collection, getDocs, doc, updateDoc, query, where, orderBy, limit, Firestore } from 'firebase/firestore';
// Import the app instance
import { app } from '../integrations/firebase/config';

// Types for our ML service
interface IncidentClassification {
  sector: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  attackVector?: string;
  confidence: number;
}

interface ThreatActorIdentification {
  name: string;
  confidence: number;
  attributes?: {
    motivation?: string;
    sophistication?: string;
    country?: string;
  };
}

interface RelatedIncident {
  id: string;
  title: string;
  similarity: number;
}

/**
 * Service for ML-based analysis of cyber incidents
 * This is a simplified implementation - in a real system, this would use actual ML models
 */
class MLService {
  private static instance: MLService | null = null;
  private db: Firestore;
  
  private constructor() {
    // Initialize Firestore with the app instance
    this.db = getFirestore(app);
  }

  /**
   * Get the singleton instance of MLService
   * Ensures Firebase is initialized before use
   */
  public static getInstance(): MLService {
    if (!MLService.instance) {
      MLService.instance = new MLService();
    }
    return MLService.instance;
  }
  
  /**
   * Classify an incident based on its text content
   * In a real implementation, this would use a trained ML model
   */
  classifyIncident(title: string, description: string): IncidentClassification {
    // Simple keyword-based classification
    const text = `${title} ${description}`.toLowerCase();
    
    // Determine sector
    let sector = 'Unknown';
    let sectorConfidence = 0.6; // Default confidence
    
    if (text.includes('bank') || text.includes('finance') || text.includes('payment')) {
      sector = 'Banking & Finance';
      sectorConfidence = 0.85;
    } else if (text.includes('power') || text.includes('electricity') || text.includes('grid')) {
      sector = 'Power & Energy';
      sectorConfidence = 0.82;
    } else if (text.includes('hospital') || text.includes('healthcare') || text.includes('medical')) {
      sector = 'Healthcare';
      sectorConfidence = 0.88;
    } else if (text.includes('transport') || text.includes('railway') || text.includes('airport')) {
      sector = 'Transportation';
      sectorConfidence = 0.79;
    } else if (text.includes('government') || text.includes('ministry') || text.includes('department')) {
      sector = 'Government';
      sectorConfidence = 0.81;
    } else if (text.includes('telecom') || text.includes('communication') || text.includes('network')) {
      sector = 'Telecommunications';
      sectorConfidence = 0.83;
    }
    
    // Determine severity
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    let severityConfidence = 0.7; // Default confidence
    
    if (text.includes('critical') || text.includes('severe') || text.includes('breach') || text.includes('leak')) {
      severity = 'critical';
      severityConfidence = 0.9;
    } else if (text.includes('high') || text.includes('major') || text.includes('significant')) {
      severity = 'high';
      severityConfidence = 0.85;
    } else if (text.includes('low') || text.includes('minor') || text.includes('small')) {
      severity = 'low';
      severityConfidence = 0.8;
    }
    
    // Determine attack vector
    let attackVector;
    let attackVectorConfidence = 0;
    
    if (text.includes('phishing')) {
      attackVector = 'Phishing';
      attackVectorConfidence = 0.92;
    } else if (text.includes('ransomware')) {
      attackVector = 'Ransomware';
      attackVectorConfidence = 0.95;
    } else if (text.includes('ddos') || text.includes('denial of service')) {
      attackVector = 'DDoS';
      attackVectorConfidence = 0.88;
    } else if (text.includes('sql injection') || text.includes('sqli')) {
      attackVector = 'SQL Injection';
      attackVectorConfidence = 0.9;
    } else if (text.includes('xss') || text.includes('cross site')) {
      attackVector = 'Cross-Site Scripting';
      attackVectorConfidence = 0.87;
    }
    
    // Overall confidence is the average of the individual confidences
    const confidences = [sectorConfidence, severityConfidence];
    if (attackVectorConfidence > 0) confidences.push(attackVectorConfidence);
    
    const overallConfidence = confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
    
    return {
      sector,
      severity,
      attackVector,
      confidence: overallConfidence
    };
  }
  
  /**
   * Identify potential threat actors based on incident characteristics
   * In a real implementation, this would use a trained ML model
   */
  identifyThreatActors(title: string, description: string, attackVector?: string): ThreatActorIdentification[] {
    const text = `${title} ${description}`.toLowerCase();
    const threatActors: ThreatActorIdentification[] = [];
    
    // Simple rule-based identification
    if (text.includes('apt') || text.includes('advanced persistent threat')) {
      if (text.includes('china') || text.includes('chinese')) {
        threatActors.push({
          name: 'APT1',
          confidence: 0.75,
          attributes: {
            motivation: 'Espionage',
            sophistication: 'High',
            country: 'China'
          }
        });
      } else if (text.includes('russia') || text.includes('russian')) {
        threatActors.push({
          name: 'APT28',
          confidence: 0.78,
          attributes: {
            motivation: 'Political',
            sophistication: 'High',
            country: 'Russia'
          }
        });
      } else if (text.includes('north korea') || text.includes('dprk')) {
        threatActors.push({
          name: 'Lazarus Group',
          confidence: 0.82,
          attributes: {
            motivation: 'Financial',
            sophistication: 'High',
            country: 'North Korea'
          }
        });
      }
    }
    
    if (text.includes('ransomware')) {
      if (text.includes('ryuk')) {
        threatActors.push({
          name: 'Wizard Spider',
          confidence: 0.88,
          attributes: {
            motivation: 'Financial',
            sophistication: 'High',
            country: 'Russia'
          }
        });
      } else if (text.includes('lockbit')) {
        threatActors.push({
          name: 'LockBit',
          confidence: 0.9,
          attributes: {
            motivation: 'Financial',
            sophistication: 'High',
            country: 'Unknown'
          }
        });
      } else if (text.includes('conti')) {
        threatActors.push({
          name: 'Conti',
          confidence: 0.85,
          attributes: {
            motivation: 'Financial',
            sophistication: 'High',
            country: 'Russia'
          }
        });
      }
    }
    
    if (attackVector === 'Phishing' && (text.includes('credential') || text.includes('password'))) {
      threatActors.push({
        name: 'TA505',
        confidence: 0.72,
        attributes: {
          motivation: 'Financial',
          sophistication: 'Medium',
          country: 'Unknown'
        }
      });
    }
    
    // If no specific threat actor was identified but there are some indicators
    if (threatActors.length === 0) {
      if (text.includes('financial') || text.includes('bank') || text.includes('money')) {
        threatActors.push({
          name: 'Unknown Financial Threat Actor',
          confidence: 0.6,
          attributes: {
            motivation: 'Financial',
            sophistication: 'Unknown',
            country: 'Unknown'
          }
        });
      } else if (text.includes('espionage') || text.includes('government') || text.includes('classified')) {
        threatActors.push({
          name: 'Unknown State-Sponsored Actor',
          confidence: 0.65,
          attributes: {
            motivation: 'Espionage',
            sophistication: 'High',
            country: 'Unknown'
          }
        });
      }
    }
    
    return threatActors;
  }
  
  /**
   * Find incidents that are similar to the given incident
   * In a real implementation, this would use vector embeddings and similarity search
   */
  async findSimilarIncidents(incidentId: string, title: string, description: string, limit: number = 5): Promise<RelatedIncident[]> {
    try {
      // In a real implementation, you would:
      // 1. Convert the text to a vector embedding
      // 2. Perform a similarity search in your vector database
      // 3. Return the most similar incidents
      
      // For this simplified implementation, we'll just do a keyword-based search
      const keywords = this.extractKeywords(title, description);
      
      if (keywords.length === 0) {
        return [];
      }
      
      const incidentsRef = collection(this.db, 'incidents');
      const allIncidentsSnapshot = await getDocs(incidentsRef);
      
      const similarIncidents: RelatedIncident[] = [];
      
      allIncidentsSnapshot.forEach(doc => {
        // Skip the current incident
        if (doc.id === incidentId) return;
        
        const data = doc.data();
        const incidentText = `${data.title} ${data.description}`.toLowerCase();
        
        // Calculate a simple similarity score based on keyword matches
        let matchCount = 0;
        for (const keyword of keywords) {
          if (incidentText.includes(keyword.toLowerCase())) {
            matchCount++;
          }
        }
        
        const similarity = matchCount / keywords.length;
        
        // Only include incidents with some similarity
        if (similarity > 0.2) {
          similarIncidents.push({
            id: doc.id,
            title: data.title,
            similarity
          });
        }
      });
      
      // Sort by similarity (highest first) and limit
      return similarIncidents
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
      
    } catch (error) {
      console.error('Error finding similar incidents:', error);
      return [];
    }
  }
  
  /**
   * Extract keywords from text
   */
  private extractKeywords(title: string, description: string): string[] {
    const text = `${title} ${description}`;
    
    // Remove common words and punctuation
    const cleanText = text.replace(/[^\w\s]/g, ' ').toLowerCase();
    const words = cleanText.split(/\s+/);
    
    // Filter out common stop words
    const stopWords = ['the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'but', 'or', 'as', 'if', 'while', 'because', 'so', 'than', 'that', 'this', 'these', 'those', 'then', 'not', 'no', 'such', 'when', 'which', 'who', 'whom', 'whose', 'what', 'where', 'why', 'how'];
    
    const keywords = words.filter(word => 
      word.length > 3 && !stopWords.includes(word)
    );
    
    // Remove duplicates and return
    return [...new Set(keywords)];
  }
  
  /**
   * Process all unprocessed incidents with ML analysis
   */
  async processUnanalyzedIncidents(): Promise<number> {
    try {
      const incidentsRef = collection(this.db, 'incidents');
      const unprocessedQuery = query(incidentsRef, where('processed', '==', false));
      const unprocessedSnapshot = await getDocs(unprocessedQuery);
      
      let processedCount = 0;
      
      for (const docSnapshot of unprocessedSnapshot.docs) {
        try {
          const incident = docSnapshot.data();
          
          // Classify the incident
          const classification = this.classifyIncident(incident.title, incident.description);
          
          // Identify threat actors
          const threatActors = this.identifyThreatActors(
            incident.title, 
            incident.description,
            classification.attackVector
          );
          
          // Find similar incidents
          const similarIncidents = await this.findSimilarIncidents(
            docSnapshot.id,
            incident.title,
            incident.description
          );
          
          // Update the incident with ML analysis
          await updateDoc(doc(this.db, 'incidents', docSnapshot.id), {
            sector: classification.sector,
            severity: classification.severity,
            attackVector: classification.attackVector,
            classificationConfidence: classification.confidence,
            threatActors: threatActors.map(ta => ({
              name: ta.name,
              confidence: ta.confidence,
              attributes: ta.attributes
            })),
            similarIncidents: similarIncidents.map(si => ({
              id: si.id,
              title: si.title,
              similarity: si.similarity
            })),
            processed: true,
            processedAt: new Date().toISOString()
          });
          
          processedCount++;
        } catch (error) {
          console.error(`Error processing incident ${docSnapshot.id}:`, error);
        }
      }
      
      return processedCount;
    } catch (error) {
      console.error('Error processing unanalyzed incidents:', error);
      throw error;
    }
  }
}

export const mlService = MLService.getInstance();