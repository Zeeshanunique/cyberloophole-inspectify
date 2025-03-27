
// Types for our data
export interface ThreatSource {
  id: string;
  name: string;
  type: "Individual" | "Group" | "Nation-state" | "Unknown";
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
  source: ThreatSource;
  targetSector: string;
  affectedSystems: string[];
  preventiveMeasures: string[];
  impactDetails: {
    financial?: string;
    operational?: string;
    reputational?: string;
    dataLoss?: string;
  }
}

// Mock data generation
export const threatSources: ThreatSource[] = [
  {
    id: "ts1",
    name: "APT36",
    type: "Group",
    location: "South Asia",
    motivation: "Espionage, Data Theft"
  },
  {
    id: "ts2",
    name: "GhostNet",
    type: "Group",
    location: "East Asia",
    motivation: "Intellectual Property Theft"
  },
  {
    id: "ts3",
    name: "LoneWolf451",
    type: "Individual",
    location: "Unknown",
    motivation: "Financial Gain"
  },
  {
    id: "ts4",
    name: "Equation Group",
    type: "Nation-state",
    location: "Unknown",
    motivation: "Intelligence Collection"
  },
  {
    id: "ts5",
    name: "DarkHydrus",
    type: "Group",
    location: "Middle East",
    motivation: "Political, Espionage"
  }
];

export const mockIncidents: CyberIncident[] = [
  {
    id: "inc1",
    title: "Critical Vulnerability in Financial API Gateway",
    description: "An authentication bypass vulnerability was discovered in a major financial services API gateway used by multiple Indian banks. The vulnerability allows attackers to access transaction data without proper authentication.",
    timestamp: "2023-08-15T08:23:15",
    severity: "critical",
    status: "active",
    category: "API Security",
    source: threatSources[0],
    targetSector: "Banking",
    affectedSystems: ["API Gateway", "Transaction Processing System"],
    preventiveMeasures: [
      "Implement proper authentication checks",
      "Add rate limiting on API endpoints",
      "Conduct security audit of all API endpoints"
    ],
    impactDetails: {
      financial: "Potential unauthorized transactions worth ₹25-40 crore",
      operational: "Banking services may face 4-hour downtime during patching",
      reputational: "High impact on customer trust",
      dataLoss: "Personal and transaction data of approximately 50,000 customers"
    }
  },
  {
    id: "inc2",
    title: "Phishing Campaign Targeting Government Officials",
    description: "A sophisticated phishing campaign is targeting Indian government officials using emails that appear to come from legitimate government departments. The emails contain malicious attachments that deploy spyware.",
    timestamp: "2023-09-02T14:45:30",
    severity: "high",
    status: "investigating",
    category: "Phishing",
    source: threatSources[1],
    targetSector: "Government",
    affectedSystems: ["Email Systems", "Workstations"],
    preventiveMeasures: [
      "Enhanced email filtering",
      "Employee security awareness training",
      "Block executable attachments"
    ],
    impactDetails: {
      operational: "Potential compromise of sensitive government communications",
      reputational: "Moderate impact on public trust in government cybersecurity",
      dataLoss: "Potential access to confidential government documents"
    }
  },
  {
    id: "inc3",
    title: "DDoS Attack on E-governance Portal",
    description: "A distributed denial-of-service (DDoS) attack targeted a major e-governance portal, causing service disruption for citizens trying to access government services online.",
    timestamp: "2023-09-10T10:12:45",
    severity: "medium",
    status: "mitigated",
    category: "DDoS",
    source: threatSources[2],
    targetSector: "Government",
    affectedSystems: ["Web Servers", "Database Servers"],
    preventiveMeasures: [
      "Implement DDoS protection services",
      "Configure rate limiting",
      "Set up traffic analysis tools"
    ],
    impactDetails: {
      operational: "Service disruption for approximately 6 hours",
      reputational: "Minor impact on citizen service trust"
    }
  },
  {
    id: "inc4",
    title: "Data Breach at Healthcare Provider",
    description: "A major healthcare provider experienced a data breach exposing patient records including personal information and medical histories.",
    timestamp: "2023-08-28T23:15:00",
    severity: "critical",
    status: "resolved",
    category: "Data Breach",
    source: threatSources[3],
    targetSector: "Healthcare",
    affectedSystems: ["Patient Database", "Electronic Health Records System"],
    preventiveMeasures: [
      "Enhance data encryption",
      "Implement regular security audits",
      "Strengthen access controls"
    ],
    impactDetails: {
      financial: "Estimated ₹10 crore in remediation costs",
      reputational: "Severe impact on patient trust",
      dataLoss: "Medical records of approximately 100,000 patients"
    }
  },
  {
    id: "inc5",
    title: "Ransomware Attack on Manufacturing Company",
    description: "A major manufacturing company was hit by ransomware, encrypting critical operational data and halting production lines.",
    timestamp: "2023-09-05T04:30:15",
    severity: "high",
    status: "mitigated",
    category: "Ransomware",
    source: threatSources[4],
    targetSector: "Manufacturing",
    affectedSystems: ["Production Systems", "Business Operations Software"],
    preventiveMeasures: [
      "Implement regular backups",
      "Update system patches regularly",
      "Deploy advanced endpoint protection"
    ],
    impactDetails: {
      financial: "Estimated ₹15 crore in production losses",
      operational: "Complete production shutdown for 48 hours"
    }
  },
  {
    id: "inc6",
    title: "Supply Chain Software Compromise",
    description: "A widely-used supply chain management software was found to contain a backdoor that allows unauthorized access to logistics data of Indian companies.",
    timestamp: "2023-09-08T16:40:22",
    severity: "medium",
    status: "investigating",
    category: "Supply Chain Attack",
    source: threatSources[0],
    targetSector: "Logistics & Transportation",
    affectedSystems: ["Supply Chain Management Software"],
    preventiveMeasures: [
      "Implement vendor security assessments",
      "Monitor third-party software activities",
      "Develop software verification processes"
    ],
    impactDetails: {
      operational: "Potential disruption to logistics operations",
      dataLoss: "Shipping manifests and logistics data potentially exposed"
    }
  },
  {
    id: "inc7",
    title: "SQL Injection in Academic Institution Portal",
    description: "A vulnerability allowing SQL injection was discovered in a portal used by multiple academic institutions across India, potentially exposing student information.",
    timestamp: "2023-09-01T09:15:45",
    severity: "low",
    status: "resolved",
    category: "Web Application Security",
    source: threatSources[2],
    targetSector: "Education",
    affectedSystems: ["Student Information System"],
    preventiveMeasures: [
      "Implement input validation",
      "Use parameterized queries",
      "Regular security code reviews"
    ],
    impactDetails: {
      dataLoss: "Student personal information potentially accessible"
    }
  }
];

// Categories for filtering
export const incidentCategories = [...new Set(mockIncidents.map(incident => incident.category))];
export const targetSectors = [...new Set(mockIncidents.map(incident => incident.targetSector))];
export const severityLevels = ["low", "medium", "high", "critical"];
export const statusOptions = ["active", "mitigated", "investigating", "resolved"];
