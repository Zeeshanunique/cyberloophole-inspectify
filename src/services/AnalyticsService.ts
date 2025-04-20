import { getFirestore, collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { app } from '../integrations/firebase/config';

// Firestore database instance
const db = getFirestore(app);

// Define public types
export type TimeRange = '1m' | '3m' | '6m' | '1y' | 'all';

export interface AnalyticsData {
  incidentsBySector: { [key: string]: number };
  incidentsBySeverity: { [key: string]: number };
  incidentsByAttackVector: { [key: string]: number };
  incidentsByMonth: { [key: string]: number };
  incidentsByThreatActor: { [key: string]: number };
  sectorVulnerabilityMatrix: { 
    labels: string[]; 
    datasets: { 
      label: string; 
      data: number[]; 
    }[] 
  };
}

class AnalyticsService {
  private static instance: AnalyticsService | null = null;

  // Singleton pattern
  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private constructor() {
    // Private constructor to enforce singleton
  }

  /**
   * Get analytics data for incidents based on time range
   */
  async getAnalyticsData(timeRange: TimeRange = '1y'): Promise<AnalyticsData> {
    try {
      const incidentsRef = collection(db, 'incidents');
      
      // Set time range filter
      let timeFilter = null;
      const now = new Date();
      
      if (timeRange !== 'all') {
        let monthsAgo;
        switch (timeRange) {
          case '1m': monthsAgo = 1; break;
          case '3m': monthsAgo = 3; break;
          case '6m': monthsAgo = 6; break;
          case '1y': monthsAgo = 12; break;
          default: monthsAgo = 12;
        }
        
        const startDate = new Date(now);
        startDate.setMonth(now.getMonth() - monthsAgo);
        timeFilter = where('date', '>=', Timestamp.fromDate(startDate));
      }
      
      // Fetch incidents with time filter
      const incidentsQuery = timeFilter 
        ? query(incidentsRef, timeFilter) 
        : query(incidentsRef);
        
      const incidentsSnapshot = await getDocs(incidentsQuery);
      
      // Initialize data structures
      const sectorMap: { [key: string]: number } = {};
      const severityMap: { [key: string]: number } = {};
      const attackVectorMap: { [key: string]: number } = {};
      const monthMap: { [key: string]: number } = {};
      const threatActorMap: { [key: string]: number } = {};
      
      // Sector vulnerability matrix data
      const sectors = new Set<string>();
      const attackVectors = new Set<string>();
      const sectorAttackMatrix: { [sector: string]: { [vector: string]: number } } = {};
      
      // Process incidents
      incidentsSnapshot.forEach(doc => {
        const data = doc.data();
        
        // Count by sector
        if (data.sector) {
          sectorMap[data.sector] = (sectorMap[data.sector] || 0) + 1;
          sectors.add(data.sector);
        }
        
        // Count by severity
        if (data.severity) {
          severityMap[data.severity] = (severityMap[data.severity] || 0) + 1;
        }
        
        // Count by attack vector
        if (data.attackVector) {
          attackVectorMap[data.attackVector] = (attackVectorMap[data.attackVector] || 0) + 1;
          attackVectors.add(data.attackVector);
          
          // Build sector-attack matrix
          if (data.sector) {
            if (!sectorAttackMatrix[data.sector]) {
              sectorAttackMatrix[data.sector] = {};
            }
            
            sectorAttackMatrix[data.sector][data.attackVector] = 
              (sectorAttackMatrix[data.sector][data.attackVector] || 0) + 1;
          }
        }
        
        // Count by month
        if (data.date) {
          const date = data.date.toDate();
          const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
          monthMap[monthYear] = (monthMap[monthYear] || 0) + 1;
        }
        
        // Count by threat actor
        if (data.threatActors && data.threatActors.length > 0) {
          data.threatActors.forEach((actor: { name: string }) => {
            if (actor.name) {
              threatActorMap[actor.name] = (threatActorMap[actor.name] || 0) + 1;
            }
          });
        }
      });
      
      // Sort months chronologically
      const sortedMonths = Object.keys(monthMap).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
      });
      
      const sortedMonthMap: { [key: string]: number } = {};
      sortedMonths.forEach(month => {
        sortedMonthMap[month] = monthMap[month];
      });
      
      // Prepare sector vulnerability matrix
      const sectorArray = Array.from(sectors);
      const attackVectorArray = Array.from(attackVectors);
      
      const sectorVulnerabilityDatasets = sectorArray.map(sector => {
        const data = attackVectorArray.map(vector => 
          (sectorAttackMatrix[sector] && sectorAttackMatrix[sector][vector]) || 0
        );
        
        return {
          label: sector,
          data
        };
      });
      
      return {
        incidentsBySector: sectorMap,
        incidentsBySeverity: severityMap,
        incidentsByAttackVector: attackVectorMap,
        incidentsByMonth: sortedMonthMap,
        incidentsByThreatActor: threatActorMap,
        sectorVulnerabilityMatrix: {
          labels: attackVectorArray,
          datasets: sectorVulnerabilityDatasets
        }
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  }

  /**
   * Get trend analysis based on month data
   */
  getTrendAnalysis(monthData: { [key: string]: number }): string {
    const months = Object.keys(monthData);
    const values = Object.values(monthData);
    
    if (months.length < 2) return "Insufficient data for trend analysis.";
    
    const lastMonth = values[values.length - 1];
    const previousMonth = values[values.length - 2];
    
    // Avoid division by zero
    if (previousMonth === 0) {
      return `There has been a significant increase in incidents in the most recent period compared to the previous one with zero incidents.`;
    }
    
    const percentChange = ((lastMonth - previousMonth) / previousMonth) * 100;
    
    if (percentChange > 10) {
      return `There has been a significant increase (${percentChange.toFixed(1)}%) in incidents in the most recent period compared to the previous one. This could indicate an emerging threat campaign or new vulnerabilities being exploited.`;
    } else if (percentChange < -10) {
      return `There has been a notable decrease (${Math.abs(percentChange).toFixed(1)}%) in incidents in the most recent period. This could be due to improved security measures or the end of a specific threat campaign.`;
    } else {
      return `The incident rate has remained relatively stable (${percentChange.toFixed(1)}% change) between the most recent periods, suggesting consistent threat activity.`;
    }
  }

  /**
   * Get strategic recommendations based on analytics data
   */
  getStrategicRecommendations(analyticsData: AnalyticsData): string[] {
    const recommendations: string[] = [];
    
    // Most targeted sector recommendation
    if (Object.keys(analyticsData.incidentsBySector).length > 0) {
      const [topSector] = Object.entries(analyticsData.incidentsBySector)
        .sort((a, b) => b[1] - a[1])[0];
      
      recommendations.push(
        `Organizations in the ${topSector} sector should implement enhanced security measures and conduct regular security assessments.`
      );
    }
    
    // Attack vector recommendation
    if (Object.keys(analyticsData.incidentsByAttackVector).length > 0) {
      const [topVector] = Object.entries(analyticsData.incidentsByAttackVector)
        .sort((a, b) => b[1] - a[1])[0];
      
      recommendations.push(
        `Prioritize defenses against ${topVector} attacks, which are the most prevalent threat vector.`
      );
    }
    
    // Threat actor recommendation
    if (Object.keys(analyticsData.incidentsByThreatActor).length > 0) {
      const [topActor] = Object.entries(analyticsData.incidentsByThreatActor)
        .sort((a, b) => b[1] - a[1])[0];
      
      recommendations.push(
        `Monitor for indicators associated with ${topActor}, the most active threat actor in the dataset.`
      );
    }
    
    // Generic recommendations
    recommendations.push(
      'Establish cross-sector information sharing to improve collective defense against common threats.',
      'Conduct regular security awareness training for employees, focusing on recognizing and responding to common attack vectors.'
    );
    
    return recommendations;
  }
}

// Create and export singleton instance
export const analyticsService = AnalyticsService.getInstance();

// Export default for convenience
export default analyticsService; 