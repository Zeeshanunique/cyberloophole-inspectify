import { app } from '../integrations/firebase/config';
import { getFirestore, collection, addDoc, writeBatch, doc } from 'firebase/firestore';

// Initialize Firestore
const db = getFirestore(app);

// Sample incident data
const sampleIncidents = [
  // Critical severity incidents
  {
    title: "SolarWinds Supply Chain Attack",
    description: "Sophisticated supply chain attack that compromised the software build system of SolarWinds' Orion platform, affecting thousands of organizations including US government agencies.",
    severity: "critical",
    sector: "Government, Technology",
    source: "CISA Alert",
    sourceUrl: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a",
    attackVector: "Supply Chain",
    status: "Resolved",
    indicatorsOfCompromise: [
      "avsvmcloud[.]com domain",
      "Suspicious SolarWinds Orion DLL files",
      "Anomalous SAML token usage"
    ],
    affectedSystems: ["SolarWinds Orion Platform", "Microsoft 365", "Azure AD"],
    timestamp: new Date("2020-12-13")
  },
  {
    title: "Log4j Vulnerability (Log4Shell)",
    description: "Critical zero-day vulnerability in Apache Log4j library (CVE-2021-44228) allowing remote code execution through JNDI injection, affecting millions of Java applications worldwide.",
    severity: "critical",
    sector: "Technology, Financial, Healthcare, Government",
    source: "Apache Foundation",
    sourceUrl: "https://logging.apache.org/log4j/2.x/security.html",
    attackVector: "Remote Code Execution",
    status: "Patched",
    indicatorsOfCompromise: [
      "Suspicious outbound LDAP/JNDI connections",
      "Exploitation attempts with ${jndi:ldap://} strings",
      "Unexpected Java class loading"
    ],
    affectedSystems: ["Java Applications", "Cloud Services", "Enterprise Software"],
    timestamp: new Date("2021-12-10")
  },
  {
    title: "Colonial Pipeline Ransomware Attack",
    description: "Major ransomware attack on Colonial Pipeline, largest fuel pipeline in the US, leading to fuel shortages across the East Coast and declaration of state of emergency in multiple states.",
    severity: "critical",
    sector: "Energy, Oil & Gas",
    source: "FBI Report",
    sourceUrl: "https://www.fbi.gov/news/press-releases/press-releases/fbi-statement-on-compromise-of-colonial-pipeline-networks",
    attackVector: "Ransomware",
    status: "Resolved",
    indicatorsOfCompromise: [
      "DarkSide ransomware signatures",
      "Suspicious VPN access",
      "Unauthorized encryption processes"
    ],
    affectedSystems: ["Billing Systems", "IT Infrastructure"],
    timestamp: new Date("2021-05-07")
  },
  
  // High severity incidents
  {
    title: "Exchange Server ProxyLogon Vulnerabilities",
    description: "Multiple zero-day vulnerabilities in Microsoft Exchange Server exploited by HAFNIUM group and others, allowing unauthorized access to email accounts and installation of web shells.",
    severity: "high",
    sector: "Multiple",
    source: "Microsoft Security",
    sourceUrl: "https://www.microsoft.com/security/blog/2021/03/02/hafnium-targeting-exchange-servers/",
    attackVector: "Zero-day Exploitation",
    status: "Patched",
    indicatorsOfCompromise: [
      "Web shells in Exchange directories",
      "Suspicious PowerShell commands",
      "Unusual Exchange log entries"
    ],
    affectedSystems: ["Microsoft Exchange Server 2013-2019"],
    timestamp: new Date("2021-03-02")
  },
  {
    title: "Kaseya VSA Ransomware Attack",
    description: "REvil ransomware gang exploited zero-day vulnerabilities in Kaseya VSA, a popular MSP platform, to deploy ransomware to approximately 1,500 businesses globally.",
    severity: "high",
    sector: "Managed Service Providers, Small Businesses",
    source: "Kaseya Advisory",
    sourceUrl: "https://www.kaseya.com/potential-attack-on-kaseya-vsa/",
    attackVector: "Supply Chain, Ransomware",
    status: "Resolved",
    indicatorsOfCompromise: [
      "REvil ransomware artifacts",
      "Suspicious VSA agent behavior",
      "Unauthorized PowerShell scripts"
    ],
    affectedSystems: ["Kaseya VSA", "Client Systems"],
    timestamp: new Date("2021-07-02")
  },
  {
    title: "Ukraine Power Grid Cyber Attack",
    description: "Sophisticated cyber attack on Ukrainian power distribution companies, causing power outages for approximately 230,000 consumers for up to 6 hours.",
    severity: "high",
    sector: "Energy, Critical Infrastructure",
    source: "ICS-CERT",
    sourceUrl: "https://www.cisa.gov/uscert/ics/alerts/IR-ALERT-H-16-056-01",
    attackVector: "Spear-phishing, BlackEnergy malware",
    status: "Resolved",
    indicatorsOfCompromise: [
      "BlackEnergy malware signatures",
      "KillDisk component",
      "Unusual VPN connections"
    ],
    affectedSystems: ["SCADA systems", "Industrial Control Systems"],
    timestamp: new Date("2015-12-23")
  },
  
  // Medium severity incidents
  {
    title: "Codecov Bash Uploader Compromise",
    description: "Supply chain attack targeting Codecov's Bash Uploader script, potentially exposing sensitive information from thousands of CI/CD pipelines.",
    severity: "medium",
    sector: "Technology, Software Development",
    source: "Codecov Security",
    sourceUrl: "https://about.codecov.io/security-update/",
    attackVector: "Supply Chain",
    status: "Resolved",
    indicatorsOfCompromise: [
      "Modified Bash Uploader script",
      "Unauthorized data exfiltration",
      "CI/CD pipeline anomalies"
    ],
    affectedSystems: ["CI/CD Pipelines", "Source Code Repositories"],
    timestamp: new Date("2021-04-15")
  },
  {
    title: "MongoDB Ransomware Attacks",
    description: "Mass attacks on unsecured MongoDB instances exposed to the internet, resulting in data being encrypted and held for ransom.",
    severity: "medium",
    sector: "Multiple",
    source: "Security Researcher Report",
    sourceUrl: "https://www.mongodb.com/security-best-practices",
    attackVector: "Unsecured Database Exposure",
    status: "Ongoing",
    indicatorsOfCompromise: [
      "Missing or encrypted collections",
      "Ransom notes in databases",
      "Unauthorized database access"
    ],
    affectedSystems: ["MongoDB Databases"],
    timestamp: new Date("2017-01-10")
  },
  {
    title: "Equifax Data Breach",
    description: "Major data breach at Equifax exposing personal information of approximately 147 million people, caused by failure to patch a known vulnerability in Apache Struts.",
    severity: "medium",
    sector: "Financial Services",
    source: "Equifax",
    sourceUrl: "https://www.equifax.com/personal/data-breach-settlement/",
    attackVector: "Web Application Vulnerability",
    status: "Resolved",
    indicatorsOfCompromise: [
      "Apache Struts exploitation",
      "Unusual database queries",
      "Data exfiltration patterns"
    ],
    affectedSystems: ["Consumer Credit Database", "Dispute Portal"],
    timestamp: new Date("2017-09-07")
  },
  
  // Low severity incidents
  {
    title: "WordPress Plugin Vulnerability in Profile Builder",
    description: "Security flaw in the popular WordPress Profile Builder plugin allowing privilege escalation for registered users.",
    severity: "low",
    sector: "Web Publishing",
    source: "WordPress Security Team",
    sourceUrl: "https://wordpress.org/plugins/profile-builder/",
    attackVector: "Plugin Vulnerability",
    status: "Patched",
    indicatorsOfCompromise: [
      "Unauthorized role changes",
      "Suspicious plugin activity",
      "Unexpected admin accounts"
    ],
    affectedSystems: ["WordPress Websites"],
    timestamp: new Date("2022-04-19")
  },
  {
    title: "DNS Cache Poisoning Vulnerability in dnsmasq",
    description: "Multiple vulnerabilities in dnsmasq software potentially allowing DNS cache poisoning and remote code execution.",
    severity: "low",
    sector: "Network Infrastructure",
    source: "CERT Advisory",
    sourceUrl: "https://www.cert.org/advisories/",
    attackVector: "DNS Poisoning",
    status: "Patched",
    indicatorsOfCompromise: [
      "Unexpected DNS responses",
      "Suspicious dnsmasq behavior",
      "Unusual network traffic patterns"
    ],
    affectedSystems: ["Network Routers", "DNS Servers"],
    timestamp: new Date("2021-01-19")
  },
  {
    title: "NPM Dependency Confusion Attack",
    description: "Technique exploiting how package managers resolve dependencies, potentially allowing attackers to inject malicious code into development environments.",
    severity: "low",
    sector: "Software Development",
    source: "Security Researcher Blog",
    sourceUrl: "https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610",
    attackVector: "Supply Chain",
    status: "Mitigable",
    indicatorsOfCompromise: [
      "Unexpected package installations",
      "Unknown package sources",
      "Suspicious package behavior"
    ],
    affectedSystems: ["NPM Development Environments", "CI/CD Pipelines"],
    timestamp: new Date("2021-02-09")
  }
];

// Sample data sources
const sampleSources = [
  {
    name: "CISA Alerts Feed",
    url: "https://www.cisa.gov/cybersecurity-advisories/all.xml",
    type: "RSS",
    cssSelector: "",
    keywords: ["vulnerability", "threat", "advisory", "alert"],
    enabled: true,
    description: "Official cybersecurity advisories from the Cybersecurity and Infrastructure Security Agency (CISA)."
  },
  {
    name: "US-CERT Current Activity",
    url: "https://www.cisa.gov/uscert/ncas/current-activity.xml",
    type: "RSS",
    cssSelector: "",
    keywords: ["vulnerability", "patch", "update", "security"],
    enabled: true,
    description: "Current cybersecurity activity provided by the United States Computer Emergency Readiness Team (US-CERT)."
  },
  {
    name: "CyberWire Daily Briefing",
    url: "https://thecyberwire.com/feeds/rss.xml",
    type: "RSS",
    cssSelector: "",
    keywords: ["breach", "attack", "incident", "ransomware"],
    enabled: true,
    description: "Daily cybersecurity news and analysis from the CyberWire team."
  },
  {
    name: "Krebs on Security",
    url: "https://krebsonsecurity.com/feed/",
    type: "RSS",
    cssSelector: "",
    keywords: ["breach", "fraud", "investigation", "cybercrime"],
    enabled: true,
    description: "In-depth security news and investigation reports from Brian Krebs."
  },
  {
    name: "National Vulnerability Database",
    url: "https://nvd.nist.gov/feeds/xml/cve/misc/nvd-rss.xml",
    type: "RSS",
    cssSelector: "",
    keywords: ["CVE", "vulnerability", "exploit", "patch"],
    enabled: true,
    description: "U.S. government repository of standards-based vulnerability management data."
  },
  {
    name: "Securelist by Kaspersky",
    url: "https://securelist.com/feed/",
    type: "RSS",
    cssSelector: "",
    keywords: ["APT", "malware", "threat actor", "campaign"],
    enabled: true,
    description: "Security research and reports from Kaspersky's Global Research & Analysis Team."
  },
  {
    name: "Microsoft Security Blog",
    url: "https://www.microsoft.com/en-us/security/blog/feed/",
    type: "RSS",
    cssSelector: "",
    keywords: ["Microsoft", "Windows", "Azure", "patch Tuesday"],
    enabled: true,
    description: "Official security guidance and research from Microsoft security teams."
  },
  {
    name: "Threat Post",
    url: "https://threatpost.com/feed/",
    type: "RSS",
    cssSelector: "",
    keywords: ["threat", "vulnerability", "exploit", "security"],
    enabled: true,
    description: "Independent news site focused on IT and business security."
  },
  {
    name: "CISA Known Exploited Vulnerabilities",
    url: "https://www.cisa.gov/known-exploited-vulnerabilities",
    type: "website",
    cssSelector: ".view-content table",
    keywords: ["exploited", "vulnerability", "patching", "required"],
    enabled: true,
    description: "Catalog of known exploited vulnerabilities that carry significant risk to federal agencies."
  },
  {
    name: "MITRE ATT&CK Updates",
    url: "https://medium.com/mitre-attack/feed",
    type: "RSS",
    cssSelector: "",
    keywords: ["technique", "tactic", "threat actor", "campaign"],
    enabled: true,
    description: "Updates to the MITRE ATT&CK knowledge base of adversary tactics and techniques."
  }
];

// Function to add sample incidents to the database
export const seedIncidents = async (): Promise<number> => {
  try {
    const incidentsRef = collection(db, "incidents");
    const batch = writeBatch(db);
    
    sampleIncidents.forEach(incident => {
      const docRef = doc(incidentsRef);
      batch.set(docRef, {
        ...incident,
        // Ensure timestamp is a Firestore timestamp
        timestamp: incident.timestamp
      });
    });
    
    await batch.commit();
    return sampleIncidents.length;
  } catch (error) {
    console.error("Error seeding incidents:", error);
    throw error;
  }
};

// Function to add sample sources to the database
export const seedSources = async (): Promise<number> => {
  try {
    const sourcesRef = collection(db, "sources");
    const batch = writeBatch(db);
    
    sampleSources.forEach(source => {
      const docRef = doc(sourcesRef);
      batch.set(docRef, {
        ...source,
        // Add timestamp for when the source was added
        addedAt: new Date()
      });
    });
    
    await batch.commit();
    return sampleSources.length;
  } catch (error) {
    console.error("Error seeding sources:", error);
    throw error;
  }
};

// Main seed function that executes all seed operations
export const seedDatabase = async (): Promise<{ incidents: number; sources: number }> => {
  try {
    const incidentsCount = await seedIncidents();
    const sourcesCount = await seedSources();
    
    return {
      incidents: incidentsCount,
      sources: sourcesCount
    };
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}; 