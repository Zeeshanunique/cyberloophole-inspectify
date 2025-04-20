
import { Timestamp } from 'firebase/firestore';

// Legacy types for backward compatibility
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

// Legacy mock data for backward compatibility
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

// Legacy incidents for backward compatibility
export const legacyIncidents: CyberIncident[] = [
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

// Categories for filtering (legacy)
export const incidentCategories = [...new Set(legacyIncidents.map(incident => incident.category))];
export const targetSectors = [...new Set(legacyIncidents.map(incident => incident.targetSector))];
export const severityLevels = ["low", "medium", "high", "critical"];
export const statusOptions = ["active", "mitigated", "investigating", "resolved"];

// New mock data for the updated application

// Mock data for cyber incidents
export const mockIncidents = [
  {
    title: "Advanced Persistent Threat Attack on Government Infrastructure",
    description: "A sophisticated APT attack targeting multiple government agencies in India was detected. The attack involved spear-phishing emails containing malicious attachments that, when opened, deployed a custom backdoor providing persistent access to the network. The attackers maintained access for approximately 3 months before detection, exfiltrating sensitive documents related to critical infrastructure.",
    severity: "critical",
    sector: "Government",
    source: "CERT-In Advisory",
    sourceUrl: "https://www.cert-in.org.in/",
    date: Timestamp.fromDate(new Date(2023, 9, 15)), // Oct 15, 2023
    status: "resolved",
    affectedSystems: ["Email Servers", "Document Management Systems", "Network Infrastructure"],
    attackVector: "Spear Phishing",
    threatActors: [
      {
        name: "APT28",
        confidence: 0.85,
        attributes: {
          motivation: "Espionage",
          sophistication: "High",
          country: "Russia"
        }
      }
    ],
    indicators: [
      "185.193.38.54",
      "secureupdate.tech",
      "b8c9e2c2a8b45f0c9e3e3e3e3e3e3e3e",
      "d4f2b7c89e1a3b5c7d9e1f3a5b7c9e1a"
    ]
  },
  {
    title: "Ransomware Attack on Healthcare Provider",
    description: "A major healthcare provider in Mumbai experienced a ransomware attack that encrypted patient records and diagnostic systems. The attack caused significant disruption to hospital operations, forcing the rescheduling of non-emergency procedures and reverting to manual record-keeping. The attackers demanded a ransom of 50 Bitcoin for the decryption keys.",
    severity: "high",
    sector: "Healthcare",
    source: "News Report",
    sourceUrl: "https://example.com/news",
    date: Timestamp.fromDate(new Date(2023, 8, 22)), // Sep 22, 2023
    status: "resolved",
    affectedSystems: ["Patient Records Database", "Diagnostic Systems", "Appointment Scheduling"],
    attackVector: "Ransomware",
    threatActors: [
      {
        name: "LockBit",
        confidence: 0.92,
        attributes: {
          motivation: "Financial",
          sophistication: "High",
          country: "Unknown"
        }
      }
    ],
    indicators: [
      "lockbit-decryptor.onion",
      "192.168.45.67",
      "7bc9e2c2a8b45f0c9e3e3e3e3e3e3e3e"
    ]
  },
  {
    title: "SQL Injection Attack on E-commerce Platform",
    description: "A popular Indian e-commerce platform suffered a data breach through SQL injection vulnerabilities in their web application. The attackers extracted customer information including names, email addresses, and hashed passwords. No financial information was compromised as it was stored on a separate, more secure system.",
    severity: "medium",
    sector: "Retail",
    source: "Security Researcher",
    sourceUrl: "https://example.com/blog",
    date: Timestamp.fromDate(new Date(2023, 10, 5)), // Nov 5, 2023
    status: "resolved",
    affectedSystems: ["Customer Database", "Web Application"],
    attackVector: "SQL Injection",
    threatActors: [
      {
        name: "Unknown Financially Motivated Actor",
        confidence: 0.65,
        attributes: {
          motivation: "Financial",
          sophistication: "Medium",
          country: "Unknown"
        }
      }
    ],
    indicators: [
      "' OR 1=1 --",
      "data-exfil.example.net",
      "45.77.123.18"
    ]
  },
  {
    title: "DDoS Attack on Banking Services",
    description: "Multiple Indian banks experienced coordinated Distributed Denial of Service (DDoS) attacks that disrupted online banking services and mobile applications for several hours. The attacks involved a botnet of compromised IoT devices generating traffic peaks of over 500 Gbps.",
    severity: "high",
    sector: "Banking & Finance",
    source: "CERT-In Alert",
    sourceUrl: "https://www.cert-in.org.in/",
    date: Timestamp.fromDate(new Date(2023, 9, 30)), // Oct 30, 2023
    status: "resolved",
    affectedSystems: ["Online Banking Portals", "Mobile Banking Apps", "Payment Gateways"],
    attackVector: "DDoS",
    threatActors: [
      {
        name: "Lazarus Group",
        confidence: 0.78,
        attributes: {
          motivation: "Disruption",
          sophistication: "High",
          country: "North Korea"
        }
      }
    ],
    indicators: [
      "botnet-c2.example.net",
      "93.184.216.34",
      "mirai-variant-signature"
    ]
  },
  {
    title: "Data Breach at Telecommunications Provider",
    description: "A major Indian telecommunications provider disclosed a data breach affecting approximately 25 million customers. The breach exposed customer names, phone numbers, addresses, and service subscription details. The company discovered the breach during a routine security audit and found evidence of unauthorized access to a customer database spanning several weeks.",
    severity: "high",
    sector: "Telecommunications",
    source: "Company Disclosure",
    sourceUrl: "https://example.com/disclosure",
    date: Timestamp.fromDate(new Date(2023, 7, 17)), // Aug 17, 2023
    status: "resolved",
    affectedSystems: ["Customer Database", "CRM System"],
    attackVector: "Credential Theft",
    threatActors: [
      {
        name: "Unknown Data Broker",
        confidence: 0.7,
        attributes: {
          motivation: "Financial",
          sophistication: "Medium",
          country: "Unknown"
        }
      }
    ],
    indicators: [
      "data-exfil.example.org",
      "45.33.22.11",
      "stolen-admin-credentials"
    ]
  },
  {
    title: "Supply Chain Attack on Software Provider",
    description: "A software provider serving multiple critical infrastructure sectors in India was compromised through a sophisticated supply chain attack. The attackers inserted a backdoor into a software update that was then distributed to customers. The malicious update allowed attackers to access systems of organizations using the affected software.",
    severity: "critical",
    sector: "Information Technology",
    source: "Security Advisory",
    sourceUrl: "https://example.com/advisory",
    date: Timestamp.fromDate(new Date(2023, 11, 3)), // Dec 3, 2023
    status: "investigating",
    affectedSystems: ["Software Build Systems", "Customer Deployments"],
    attackVector: "Supply Chain",
    threatActors: [
      {
        name: "UNC2452",
        confidence: 0.88,
        attributes: {
          motivation: "Espionage",
          sophistication: "Very High",
          country: "Russia"
        }
      }
    ],
    indicators: [
      "sunburst-backdoor-hash",
      "c2.malicious-domain.com",
      "195.123.45.67",
      "8a7b6c5d4e3f2g1h"
    ]
  },
  {
    title: "Phishing Campaign Targeting Energy Sector",
    description: "A coordinated phishing campaign specifically targeted employees of multiple energy companies in India. The emails impersonated regulatory authorities and contained links to fake login pages designed to steal credentials. Several employees fell victim to the attack, resulting in compromised accounts that were used to access internal systems.",
    severity: "medium",
    sector: "Power & Energy",
    source: "CERT-In Advisory",
    sourceUrl: "https://www.cert-in.org.in/",
    date: Timestamp.fromDate(new Date(2023, 10, 12)), // Nov 12, 2023
    status: "resolved",
    affectedSystems: ["Email Accounts", "VPN Access"],
    attackVector: "Phishing",
    threatActors: [
      {
        name: "DragonFly",
        confidence: 0.75,
        attributes: {
          motivation: "Espionage",
          sophistication: "High",
          country: "Russia"
        }
      }
    ],
    indicators: [
      "energy-regulatory-update.com",
      "login-secure-portal.net",
      "87.65.43.21"
    ]
  },
  {
    title: "Zero-Day Vulnerability Exploited in Critical Infrastructure",
    description: "A previously unknown vulnerability in industrial control systems was exploited to target water treatment facilities in India. The attackers attempted to manipulate control systems that regulate water treatment processes. The attack was detected before any harmful changes could be implemented, but highlighted significant vulnerabilities in critical infrastructure protection.",
    severity: "critical",
    sector: "Water & Wastewater",
    source: "Intelligence Report",
    sourceUrl: "https://example.com/report",
    date: Timestamp.fromDate(new Date(2023, 11, 20)), // Dec 20, 2023
    status: "resolved",
    affectedSystems: ["SCADA Systems", "Industrial Control Systems"],
    attackVector: "Zero-Day Exploit",
    threatActors: [
      {
        name: "APT41",
        confidence: 0.82,
        attributes: {
          motivation: "Sabotage",
          sophistication: "Very High",
          country: "China"
        }
      }
    ],
    indicators: [
      "scada-exploit-payload",
      "control-systems.example.net",
      "76.54.32.10"
    ]
  },
  {
    title: "Insider Threat at Financial Institution",
    description: "An employee at a major Indian financial institution abused privileged access to exfiltrate sensitive financial data and customer information. The insider collected data over a period of six months before the activity was detected through anomalous data access patterns identified by security monitoring tools.",
    severity: "high",
    sector: "Banking & Finance",
    source: "Law Enforcement",
    sourceUrl: "https://example.com/news",
    date: Timestamp.fromDate(new Date(2023, 8, 5)), // Sep 5, 2023
    status: "resolved",
    affectedSystems: ["Financial Databases", "Customer Records"],
    attackVector: "Insider Threat",
    indicators: [
      "unusual-data-access-patterns",
      "after-hours-activity",
      "large-data-transfers"
    ]
  },
  {
    title: "Mobile Banking Trojan Targeting Indian Users",
    description: "A sophisticated banking trojan specifically targeting users of Indian banking applications was discovered on multiple third-party Android app stores. The malware, disguised as legitimate utility apps, could overlay fake login screens over genuine banking apps to steal credentials and intercept SMS messages containing transaction authorization codes.",
    severity: "medium",
    sector: "Banking & Finance",
    source: "Security Researcher",
    sourceUrl: "https://example.com/blog",
    date: Timestamp.fromDate(new Date(2023, 10, 25)), // Nov 25, 2023
    status: "investigating",
    affectedSystems: ["Mobile Banking Applications", "SMS Authentication"],
    attackVector: "Malware",
    threatActors: [
      {
        name: "TA505",
        confidence: 0.7,
        attributes: {
          motivation: "Financial",
          sophistication: "High",
          country: "Unknown"
        }
      }
    ],
    indicators: [
      "com.utility.flashlight.app",
      "banking-c2.example.net",
      "23.45.67.89",
      "9a8b7c6d5e4f3g2h1i"
    ]
  }
];

// Mock data for preventive measures
export const mockPreventiveMeasures = [
  {
    title: "Multi-Factor Authentication",
    category: "Access Control",
    description: "Implement multi-factor authentication for all remote access to critical systems and sensitive data. This adds an additional layer of security beyond passwords, requiring users to provide a second form of verification.",
    implementation: "Deploy MFA solutions for VPN access, email systems, cloud services, and administrative accounts. Use a combination of something the user knows (password), something they have (security token or mobile device), and/or something they are (biometrics).",
    effectiveness: "high",
    applicableSectors: ["All Sectors"],
    relatedAttackVectors: ["Credential Theft", "Phishing", "Brute Force"]
  },
  {
    title: "Network Segmentation",
    category: "Network Security",
    description: "Divide network infrastructure into separate segments with controlled access between them. This limits lateral movement in case of a breach and contains the impact to specific segments.",
    implementation: "Implement VLANs, firewalls, and access control lists to create logical boundaries between different parts of the network. Separate operational technology (OT) networks from information technology (IT) networks in industrial environments.",
    effectiveness: "high",
    applicableSectors: ["Power & Energy", "Manufacturing", "Healthcare", "Government", "Banking & Finance"],
    relatedAttackVectors: ["Lateral Movement", "APT", "Malware Propagation"]
  },
  {
    title: "Security Awareness Training",
    category: "Human Factors",
    description: "Conduct regular security awareness training for all employees to help them recognize and respond appropriately to security threats such as phishing attempts, social engineering, and suspicious activities.",
    implementation: "Develop a comprehensive training program that includes phishing simulations, security best practices, incident reporting procedures, and role-specific security responsibilities. Conduct training at onboarding and regular refresher sessions.",
    effectiveness: "medium",
    applicableSectors: ["All Sectors"],
    relatedAttackVectors: ["Phishing", "Social Engineering", "Insider Threat"]
  },
  {
    title: "Vulnerability Management Program",
    category: "Infrastructure Security",
    description: "Establish a systematic approach to identifying, assessing, prioritizing, and remediating security vulnerabilities across all systems and applications.",
    implementation: "Implement regular vulnerability scanning, establish a patch management process, conduct penetration testing, and maintain an up-to-date inventory of all assets. Prioritize vulnerabilities based on criticality and exploitability.",
    effectiveness: "high",
    applicableSectors: ["All Sectors"],
    relatedAttackVectors: ["Exploitation", "Zero-Day", "Supply Chain"]
  },
  {
    title: "Data Loss Prevention",
    category: "Data Security",
    description: "Implement technologies and processes to detect and prevent unauthorized access, use, or transmission of sensitive data, whether by external attackers or insiders.",
    implementation: "Deploy DLP solutions to monitor, detect, and block sensitive data in motion (network), at rest (storage), and in use (endpoint). Define data classification policies and implement appropriate controls based on data sensitivity.",
    effectiveness: "medium",
    applicableSectors: ["Banking & Finance", "Healthcare", "Government", "Telecommunications"],
    relatedAttackVectors: ["Data Exfiltration", "Insider Threat"]
  },
  {
    title: "Incident Response Plan",
    category: "Operational Security",
    description: "Develop and maintain a formal incident response plan that outlines the procedures for detecting, responding to, and recovering from security incidents.",
    implementation: "Create a documented plan that defines roles and responsibilities, communication protocols, containment strategies, eradication procedures, and recovery processes. Regularly test the plan through tabletop exercises and simulations.",
    effectiveness: "high",
    applicableSectors: ["All Sectors"],
    relatedAttackVectors: ["All Attack Vectors"]
  },
  {
    title: "Secure Software Development",
    category: "Application Security",
    description: "Integrate security throughout the software development lifecycle to identify and address vulnerabilities early in the process, reducing the risk of security issues in production systems.",
    implementation: "Implement secure coding standards, conduct regular code reviews, perform security testing (SAST, DAST, SCA), and provide security training for developers. Establish a process for addressing security vulnerabilities in the development pipeline.",
    effectiveness: "high",
    applicableSectors: ["Information Technology", "Banking & Finance", "Healthcare"],
    relatedAttackVectors: ["SQL Injection", "XSS", "CSRF", "Supply Chain"]
  },
  {
    title: "Backup and Recovery",
    category: "Resilience",
    description: "Implement comprehensive backup and recovery solutions to ensure data can be restored in the event of data loss, corruption, or ransomware attacks.",
    implementation: "Follow the 3-2-1 backup rule: maintain at least three copies of data on two different storage types with one copy stored offsite. Implement air-gapped backups that are disconnected from the network. Regularly test backup restoration procedures.",
    effectiveness: "high",
    applicableSectors: ["All Sectors"],
    relatedAttackVectors: ["Ransomware", "Data Destruction", "Natural Disasters"]
  },
  {
    title: "Zero Trust Architecture",
    category: "Access Control",
    description: "Implement a security model that requires strict identity verification for every person and device trying to access resources, regardless of their location relative to the network perimeter.",
    implementation: "Apply the principle of 'never trust, always verify' by implementing micro-segmentation, least privilege access, multi-factor authentication, and continuous monitoring and validation. Verify all access requests regardless of source.",
    effectiveness: "high",
    applicableSectors: ["Government", "Banking & Finance", "Healthcare", "Information Technology"],
    relatedAttackVectors: ["APT", "Lateral Movement", "Credential Theft"]
  },
  {
    title: "Security Information and Event Management (SIEM)",
    category: "Monitoring",
    description: "Deploy SIEM solutions to collect, analyze, and correlate security event data from multiple sources to identify potential security incidents and facilitate rapid response.",
    implementation: "Integrate logs from network devices, servers, applications, and security controls. Establish use cases and correlation rules to detect suspicious activities. Implement automated alerting and response workflows.",
    effectiveness: "medium",
    applicableSectors: ["All Sectors"],
    relatedAttackVectors: ["All Attack Vectors"]
  }
];

// Mock data for threat actors
export const mockThreatActors = [
  {
    name: "APT28",
    aliases: ["Fancy Bear", "Sofacy", "Sednit", "Pawn Storm"],
    description: "A sophisticated threat actor primarily associated with the Russian government. Known for targeting government, military, and security organizations worldwide, particularly those involved in international affairs.",
    motivation: "Espionage",
    sophistication: "High",
    country: "Russia",
    targetedSectors: ["Government", "Defense", "International Organizations", "Think Tanks"],
    commonTactics: ["Spear Phishing", "Zero-Day Exploits", "Custom Malware", "Credential Theft"],
    indicators: [
      "X-Tunnel malware",
      "CHOPSTICK malware",
      "Specific command and control infrastructure patterns"
    ]
  },
  {
    name: "Lazarus Group",
    aliases: ["Hidden Cobra", "Guardians of Peace", "APT38"],
    description: "A highly active threat group primarily associated with North Korea. Known for both espionage and financially motivated attacks, including cryptocurrency theft and bank heists.",
    motivation: "Financial Gain, Espionage",
    sophistication: "High",
    country: "North Korea",
    targetedSectors: ["Banking & Finance", "Cryptocurrency", "Defense", "Media"],
    commonTactics: ["Spear Phishing", "Watering Hole Attacks", "Custom Malware", "Living Off the Land"],
    indicators: [
      "HOPLIGHT malware",
      "ELECTRICFISH malware",
      "Specific code reuse patterns across campaigns"
    ]
  },
  {
    name: "APT41",
    aliases: ["Double Dragon", "Wicked Panda", "Barium"],
    description: "A Chinese threat actor that conducts state-sponsored espionage activity and financially motivated attacks. Known for targeting healthcare, high-tech, and telecommunications sectors.",
    motivation: "Espionage, Financial Gain",
    sophistication: "Very High",
    country: "China",
    targetedSectors: ["Healthcare", "Telecommunications", "High-Tech", "Gaming"],
    commonTactics: ["Supply Chain Attacks", "Spear Phishing", "Exploiting Public-Facing Applications", "Credential Theft"],
    indicators: [
      "POISONPLUG malware",
      "HIGHNOON backdoor",
      "Specific command and control patterns"
    ]
  },
  {
    name: "DragonFly",
    aliases: ["Energetic Bear", "Crouching Yeti", "IRON LIBERTY"],
    description: "A threat actor primarily focused on targeting energy and industrial sectors. Known for gaining access to operational technology networks and industrial control systems.",
    motivation: "Espionage, Sabotage",
    sophistication: "High",
    country: "Russia",
    targetedSectors: ["Power & Energy", "Nuclear", "Manufacturing", "Water & Wastewater"],
    commonTactics: ["Spear Phishing", "Watering Hole Attacks", "Trojanized Software", "Credential Harvesting"],
    indicators: [
      "HAVEX malware",
      "Dorshel trojan",
      "Specific targeting of ICS/SCADA systems"
    ]
  },
  {
    name: "LockBit",
    aliases: ["LockBit Ransomware Group"],
    description: "A ransomware-as-a-service (RaaS) operation that emerged in 2019. Known for double extortion tactics, threatening to publish stolen data if ransom is not paid.",
    motivation: "Financial Gain",
    sophistication: "High",
    country: "Unknown (Likely Eastern Europe)",
    targetedSectors: ["Manufacturing", "Professional Services", "Construction", "Retail", "Healthcare"],
    commonTactics: ["Phishing", "Exploiting Public-Facing Applications", "Valid Accounts", "Data Encryption", "Data Exfiltration"],
    indicators: [
      "LockBit ransomware variants",
      "StealBit data exfiltration tool",
      "Specific ransom notes and TOR payment sites"
    ]
  },
  {
    name: "TA505",
    aliases: ["Evil Corp", "GOLD DRAKE"],
    description: "A financially motivated threat actor active since at least 2014. Known for distributing banking trojans, ransomware, and other malware through large-scale email campaigns.",
    motivation: "Financial Gain",
    sophistication: "High",
    country: "Russia",
    targetedSectors: ["Banking & Finance", "Retail", "Healthcare", "Manufacturing"],
    commonTactics: ["Phishing", "Malicious Documents", "PowerShell", "Living Off the Land"],
    indicators: [
      "Dridex banking trojan",
      "FlawedAmmyy RAT",
      "Clop ransomware",
      "Get2 downloader"
    ]
  },
  {
    name: "UNC2452",
    aliases: ["SolarWinds Attackers", "NOBELIUM"],
    description: "The threat actor behind the 2020 SolarWinds supply chain attack. Known for extremely sophisticated tradecraft and operational security.",
    motivation: "Espionage",
    sophistication: "Very High",
    country: "Russia",
    targetedSectors: ["Government", "Technology", "Critical Infrastructure", "Consulting"],
    commonTactics: ["Supply Chain Attacks", "Token Theft", "Privilege Escalation", "Stealthy Infrastructure"],
    indicators: [
      "SUNBURST backdoor",
      "TEARDROP malware",
      "SUNSPOT build system compromise"
    ]
  },
  {
    name: "Conti",
    aliases: ["Wizard Spider", "GOLD ULRICK"],
    description: "A ransomware operation that emerged in 2020 as a successor to Ryuk. Known for targeting critical infrastructure and high-value organizations.",
    motivation: "Financial Gain",
    sophistication: "High",
    country: "Russia",
    targetedSectors: ["Healthcare", "Government", "Emergency Services", "Manufacturing"],
    commonTactics: ["Phishing", "Exploiting Public-Facing Applications", "Valid Accounts", "Data Encryption", "Data Exfiltration"],
    indicators: [
      "Conti ransomware",
      "BazarLoader/BazarBackdoor",
      "TrickBot infections preceding Conti"
    ]
  },
  {
    name: "APT29",
    aliases: ["Cozy Bear", "The Dukes", "NOBELIUM"],
    description: "A sophisticated threat actor associated with the Russian Foreign Intelligence Service (SVR). Known for well-planned, stealthy operations focusing on intelligence collection.",
    motivation: "Espionage",
    sophistication: "Very High",
    country: "Russia",
    targetedSectors: ["Government", "Diplomatic", "Think Tanks", "Healthcare Research"],
    commonTactics: ["Spear Phishing", "Supply Chain Attacks", "Custom Malware", "Living Off the Land"],
    indicators: [
      "WellMess malware",
      "WellMail malware",
      "CosmicDuke toolkit"
    ]
  },
  {
    name: "Mustang Panda",
    aliases: ["Red Delta", "BRONZE PRESIDENT", "HoneyMyte"],
    description: "A Chinese threat actor that primarily targets non-governmental organizations, diplomatic missions, and research institutions, particularly those related to South Asian geopolitics.",
    motivation: "Espionage",
    sophistication: "Medium to High",
    country: "China",
    targetedSectors: ["Government", "Non-Governmental Organizations", "Education", "Religious Institutions"],
    commonTactics: ["Spear Phishing", "Malicious Documents", "PlugX Malware Variants", "Custom Loaders"],
    indicators: [
      "PlugX malware variants",
      "Cobalt Strike usage",
      "Specific document lures related to regional geopolitics"
    ]
  }
];

// Mock data for data sources
export const mockDataSources = [
  {
    name: "CERT-In Advisories",
    url: "https://www.cert-in.org.in/",
    type: "website",
    selectors: {
      container: ".advisory-container",
      title: "h3.advisory-title",
      content: "div.advisory-content",
      date: "span.advisory-date"
    },
    keywords: ["vulnerability", "advisory", "cyber attack", "security incident", "breach", "malware", "ransomware", "phishing"],
    enabled: true
  },
  {
    name: "NCIIPC Alerts",
    url: "https://nciipc.gov.in/",
    type: "website",
    selectors: {
      container: ".alert-item",
      title: ".alert-title",
      content: ".alert-description",
      date: ".alert-date"
    },
    keywords: ["critical infrastructure", "vulnerability", "threat", "advisory", "alert", "power sector", "energy", "banking", "telecom"],
    enabled: true
  },
  {
    name: "Indian Cybercrime Coordination Centre",
    url: "https://www.i4c.gov.in/",
    type: "website",
    selectors: {
      container: ".news-item",
      title: "h4.news-title",
      content: "div.news-content",
      date: "span.news-date"
    },
    keywords: ["cybercrime", "fraud", "scam", "attack", "data theft", "financial crime", "online fraud"],
    enabled: true
  },
  {
    name: "The Hacker News - India",
    url: "https://thehackernews.com/search/label/India",
    type: "rss",
    keywords: ["India", "Indian", "cyber attack", "breach", "vulnerability", "hack", "security incident", "data leak"],
    enabled: true
  },
  {
    name: "Twitter - Cybersecurity India",
    url: "https://twitter.com/search?q=cybersecurity%20india",
    type: "twitter",
    keywords: ["cybersecurity", "India", "attack", "breach", "vulnerability", "threat", "incident", "hack"],
    enabled: true
  },
  {
    name: "Reddit - r/cybersecurity India posts",
    url: "https://www.reddit.com/r/cybersecurity/search/?q=india",
    type: "reddit",
    keywords: ["India", "Indian", "attack", "breach", "vulnerability", "critical infrastructure", "government"],
    enabled: true
  },
  {
    name: "GitHub Security Advisories",
    url: "https://github.com/advisories",
    type: "github",
    keywords: ["India", "Indian", "critical", "vulnerability", "remote code execution", "authentication bypass"],
    enabled: true
  },
  {
    name: "Pastebin - Cyber Leaks",
    url: "https://pastebin.com/search?q=india+leak",
    type: "pastebin",
    keywords: ["India", "leak", "database", "credentials", "breach", "dump", "hack"],
    enabled: false
  },
  {
    name: "DataBreachToday India",
    url: "https://www.databreachtoday.in/",
    type: "website",
    selectors: {
      container: "article.article",
      title: "h1.article-title",
      content: "div.article-content",
      date: "time.article-date"
    },
    keywords: ["data breach", "leak", "India", "Indian", "compromise", "exposed", "stolen data"],
    enabled: true
  },
  {
    name: "Economic Times - Cybersecurity",
    url: "https://economictimes.indiatimes.com/tech/technology/cybersecurity",
    type: "website",
    selectors: {
      container: ".article-container",
      title: "h2.article-title",
      content: "div.article-summary",
      date: "span.article-date"
    },
    keywords: ["cyber attack", "breach", "hack", "vulnerability", "security incident", "data leak", "ransomware"],
    enabled: true
  }
];

// Export all mock data
export const mockData = {
  incidents: mockIncidents,
  preventiveMeasures: mockPreventiveMeasures,
  threatActors: mockThreatActors,
  dataSources: mockDataSources
};
