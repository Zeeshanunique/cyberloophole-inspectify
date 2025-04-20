import { app } from '../integrations/firebase/config';
import { getFirestore, collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore';
import { toast } from '@/components/ui/use-toast';

// Initialize Firestore with the app instance
const db = getFirestore(app);

// Sample data for cyber incidents
const sampleIncidents = [
  {
    title: "Major Phishing Campaign Targets Indian Financial Institutions",
    description: "A sophisticated phishing campaign has been detected targeting multiple financial institutions across India. The attackers are using emails that appear to come from the Reserve Bank of India, containing malicious attachments that install backdoor access to systems. Several banks have reported unauthorized access attempts.",
    severity: "high",
    sector: "Banking & Finance",
    source: "CERT-In Advisory",
    sourceUrl: "https://www.cert-in.org.in",
    date: new Date(2023, 1, 15),
    status: "investigating",
    attackVector: "Phishing",
    indicators: ["malicious-domain.com", "185.132.45.23", "d41d8cd98f00b204e9800998ecf8427e"],
    affectedSystems: ["Email Systems", "Customer Database"]
  },
  {
    title: "Ransomware Attack on Healthcare Provider",
    description: "A major hospital chain in India has reported a ransomware attack affecting multiple facilities. Patient data has been encrypted, and systems were taken offline as a precaution. Emergency services were diverted to other hospitals temporarily. The attackers are demanding 50 Bitcoin for the decryption key.",
    severity: "critical",
    sector: "Healthcare",
    source: "NCIIPC Report",
    sourceUrl: "https://nciipc.gov.in",
    date: new Date(2023, 2, 8),
    status: "investigating",
    attackVector: "Ransomware",
    indicators: ["cryptlocker45.bit", "192.168.14.2", "7e6bfa6f129ef0d63926d506419809f2"],
    affectedSystems: ["Patient Records System", "Pharmacy Management", "Appointment Scheduling"]
  },
  {
    title: "DDoS Attack on Government Services Portal",
    description: "The national e-governance services portal experienced a sustained distributed denial of service (DDoS) attack, causing intermittent outages for approximately 6 hours. The attack peaked at 1.2 Tbps, making it one of the largest DDoS attacks recorded in the country.",
    severity: "high",
    sector: "Government",
    source: "Ministry of Electronics & IT",
    sourceUrl: "https://www.meity.gov.in",
    date: new Date(2023, 3, 22),
    status: "resolved",
    attackVector: "DDoS",
    indicators: ["botnet-c2.net", "103.242.56.78"],
    affectedSystems: ["Web Portal", "Authentication Services"]
  },
  {
    title: "Data Breach at Major E-commerce Platform",
    description: "A prominent Indian e-commerce platform disclosed a data breach affecting over 3.5 million customers. The compromised data includes names, email addresses, phone numbers, and hashed passwords. Credit card information was reportedly not affected due to being stored on a separate system with stronger encryption.",
    severity: "high",
    sector: "Retail",
    source: "Company Disclosure",
    sourceUrl: "https://example-ecommerce.com/security",
    date: new Date(2023, 4, 5),
    status: "resolved",
    attackVector: "SQL Injection",
    indicators: ["exfil-domain.xyz", "45.89.126.32", "5f4dcc3b5aa765d61d8327deb882cf99"],
    affectedSystems: ["Customer Database", "User Authentication System"]
  },
  {
    title: "Critical Vulnerability in Power Grid Management System",
    description: "A vulnerability in the SCADA systems used by several power distribution companies in northern India was discovered. The vulnerability could potentially allow remote attackers to disrupt power supply or gain unauthorized access to operational data. Patches have been issued and are being deployed urgently.",
    severity: "critical",
    sector: "Power & Energy",
    source: "ICS-CERT Advisory",
    sourceUrl: "https://ics-cert.us-cert.gov",
    date: new Date(2023, 5, 18),
    status: "new",
    attackVector: "Remote Code Execution",
    indicators: ["suspicious-update.org", "87.236.45.122"],
    affectedSystems: ["SCADA Systems", "Control Network"]
  },
  {
    title: "Telecom Provider Reports Data Interception Attempt",
    description: "A major telecommunications provider has detected an attempted man-in-the-middle attack that could have intercepted customer communications. The attack was identified and blocked before any significant data was compromised, but it represents a sophisticated attempt to target critical infrastructure.",
    severity: "medium",
    sector: "Telecommunications",
    source: "Industry Report",
    sourceUrl: "https://example-telecom.com/security",
    date: new Date(2023, 6, 30),
    status: "resolved",
    attackVector: "Man-in-the-Middle Attack",
    indicators: ["cert-spoof.co", "172.35.24.19", "9d5ed678fe57bcca2163f85f0cb635ea"],
    affectedSystems: ["Routing Infrastructure", "SSL Certificate Management"]
  },
  {
    title: "Supply Chain Attack Affects Software Vendors",
    description: "Multiple Indian software vendors have been affected by a sophisticated supply chain attack. The attackers compromised a popular code repository and injected malicious code into software dependencies. When compiled, the affected libraries establish a backdoor connection to attacker-controlled servers.",
    severity: "high",
    sector: "Technology",
    source: "NCSC Alert",
    sourceUrl: "https://ncsc.gov.in",
    date: new Date(2023, 7, 12),
    status: "investigating",
    attackVector: "Supply Chain Attack",
    indicators: ["update-server.biz", "45.132.97.43", "b0d5ce2d38a65cc3d621a90f6f20886c"],
    affectedSystems: ["Development Environment", "Production Systems"]
  },
  {
    title: "Banking Trojan Targets Mobile Applications",
    description: "A new Android banking trojan specifically targeting Indian banking apps has been discovered. The malware overlays fake login screens over legitimate banking applications to steal credentials. It has been distributed through third-party app stores and phishing messages claiming to be banking security updates.",
    severity: "high",
    sector: "Banking & Finance",
    source: "Cybersecurity Firm Report",
    sourceUrl: "https://example-security.com/research",
    date: new Date(2023, 8, 25),
    status: "new",
    attackVector: "Mobile Malware",
    indicators: ["fake-banking-update.apk", "bankingsecurity.info", "c2db47e68544cbc7805b5a9a33c7feae"],
    affectedSystems: ["Mobile Banking Applications"]
  },
  {
    title: "Credential Stuffing Attack on Educational Institutions",
    description: "Several universities and educational institutions across India have reported unauthorized access attempts through credential stuffing attacks. The attackers are using credentials leaked from other breaches to gain access to student and faculty accounts, potentially compromising research data and personal information.",
    severity: "medium",
    sector: "Education",
    source: "Education Ministry Advisory",
    sourceUrl: "https://education.gov.in/cyber-advisory",
    date: new Date(2023, 9, 7),
    status: "investigating",
    attackVector: "Credential Stuffing",
    indicators: ["auth-proxy.net", "91.223.89.14", "68eacb97d86f0c4621fa2b0e17cabd8c"],
    affectedSystems: ["Student Information System", "Faculty Portal", "Research Database"]
  },
  {
    title: "Railway Booking System Disruption",
    description: "The online railway reservation system experienced technical disruptions due to a suspected cyber attack. Initial investigation indicates a potential API abuse attack that overwhelmed the booking servers. The system was temporarily taken offline and restored after security measures were implemented.",
    severity: "medium",
    sector: "Transportation",
    source: "Ministry of Railways",
    sourceUrl: "https://indianrailways.gov.in",
    date: new Date(2023, 10, 19),
    status: "resolved",
    attackVector: "API Abuse",
    indicators: ["ticket-bot.cc", "185.156.73.91"],
    affectedSystems: ["Online Reservation System", "Payment Gateway"]
  }
];

// Sample data sources
const sampleSources = [
  {
    name: "CERT-In Advisories",
    url: "https://www.cert-in.org.in/",
    type: "website",
    selectors: {
      container: "article.advisory",
      title: "h2.advisory-title",
      content: "div.advisory-content",
      date: "span.advisory-date"
    },
    keywords: ["vulnerability", "critical", "advisory", "alert", "cyber", "security"],
    enabled: true
  },
  {
    name: "NCIIPC Alerts",
    url: "https://nciipc.gov.in/",
    type: "rss",
    keywords: ["critical infrastructure", "power", "energy", "telecom", "finance", "cyber attack"],
    enabled: true
  },
  {
    name: "Ministry of Electronics & IT",
    url: "https://www.meity.gov.in/",
    type: "website",
    selectors: {
      container: "div.notification-item",
      title: "h3.notification-title",
      content: "div.notification-content",
      date: "span.notification-date"
    },
    keywords: ["cyber", "digital", "security", "breach", "data", "attack"],
    enabled: true
  },
  {
    name: "CyberSecurity Threat Intelligence Feed",
    url: "https://example-security-feed.com/feed",
    type: "rss",
    keywords: ["India", "attack", "threat", "malware", "phishing", "vulnerability"],
    enabled: true
  },
  {
    name: "Indian Cybersecurity News Aggregator",
    url: "https://cyberindia-news.example.com",
    type: "website",
    selectors: {
      container: "div.news-item",
      title: "h2.news-title",
      content: "div.news-content",
      date: "span.news-date"
    },
    keywords: ["breach", "hack", "incident", "cyber", "attack", "vulnerability"],
    enabled: true
  },
];

/**
 * Add sample incidents to the database.
 * This function also returns the count of existing incidents, which can be used to check
 * if the database has already been seeded.
 * @returns {Promise<number>} The number of existing incidents found
 */
export const seedIncidents = async () => {
  try {
    // Check if incidents already exist to avoid duplicates
    const incidentsRef = collection(db, 'incidents');
    const existingSnapshot = await getDocs(incidentsRef);
    
    if (!existingSnapshot.empty) {
      if (existingSnapshot.size >= 5) {
        toast({
          title: "Database already seeded",
          description: `Found ${existingSnapshot.size} incidents already in the database.`,
          variant: "default",
        });
        return existingSnapshot.size;
      }
    }
    
    let addedCount = 0;
    
    // Add each incident if it doesn't already exist
    for (const incident of sampleIncidents) {
      // Check if this incident already exists (based on title)
      const existingQuery = query(
        incidentsRef,
        where('title', '==', incident.title)
      );
      
      const existingSnapshot = await getDocs(existingQuery);
      if (!existingSnapshot.empty) {
        console.log('Incident already exists, skipping:', incident.title);
        continue;
      }
      
      // Add the incident
      await addDoc(incidentsRef, {
        ...incident,
        date: Timestamp.fromDate(incident.date),
        collectedAt: Timestamp.now(),
        processed: true
      });
      
      addedCount++;
    }
    
    toast({
      title: "Database seeded successfully",
      description: `Added ${addedCount} new incidents to the database.`,
      variant: "default",
    });
    
    return addedCount;
  } catch (error) {
    console.error('Error seeding incidents:', error);
    toast({
      title: "Error seeding database",
      description: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Add sample data sources to the database
 */
export const seedSources = async () => {
  try {
    // Check if sources already exist to avoid duplicates
    const sourcesRef = collection(db, 'dataSources');
    const existingSnapshot = await getDocs(sourcesRef);
    
    if (!existingSnapshot.empty) {
      if (existingSnapshot.size >= 3) {
        toast({
          title: "Sources already seeded",
          description: `Found ${existingSnapshot.size} sources already in the database.`,
          variant: "default",
        });
        return existingSnapshot.size;
      }
    }
    
    let addedCount = 0;
    
    // Add each source if it doesn't already exist
    for (const source of sampleSources) {
      // Check if this source already exists (based on name)
      const existingQuery = query(
        sourcesRef,
        where('name', '==', source.name)
      );
      
      const existingSnapshot = await getDocs(existingQuery);
      if (!existingSnapshot.empty) {
        console.log('Source already exists, skipping:', source.name);
        continue;
      }
      
      // Add the source
      await addDoc(sourcesRef, {
        ...source,
        lastScraped: null
      });
      
      addedCount++;
    }
    
    toast({
      title: "Sources seeded successfully",
      description: `Added ${addedCount} new data sources to the database.`,
      variant: "default",
    });
    
    return addedCount;
  } catch (error) {
    console.error('Error seeding sources:', error);
    toast({
      title: "Error seeding sources",
      description: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Main function to seed all data
 */
export const seedDatabase = async () => {
  try {
    const incidentsCount = await seedIncidents();
    const sourcesCount = await seedSources();
    
    return {
      incidents: incidentsCount,
      sources: sourcesCount
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};