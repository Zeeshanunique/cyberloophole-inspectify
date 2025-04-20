import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { app } from '../integrations/firebase/config';

const db = getFirestore(app);

// Sample incidents data
const sampleIncidents = [
  {
    title: "SQL Injection Attempt",
    description: "Multiple SQL injection attempts detected on the login page from IP 203.0.113.42",
    severity: "high",
    status: "resolved",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 2)), // 2 days ago
    affectedSystems: ["authentication-service", "user-database"],
    reporter: "Security Monitoring System",
    assignedTo: "Jane Doe",
    remediation: "IP blocked and login page input validation strengthened"
  },
  {
    title: "Unauthorized Access to Admin Panel",
    description: "User account with limited privileges accessed admin panel through misconfigured permissions",
    severity: "critical",
    status: "investigating",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000)), // 1 day ago
    affectedSystems: ["admin-portal", "permissions-service"],
    reporter: "John Smith",
    assignedTo: "Security Team",
    remediation: "Reviewing permissions model and implementing additional access controls"
  },
  {
    title: "Suspicious Login Activity",
    description: "Multiple failed login attempts followed by successful login from unusual location",
    severity: "medium",
    status: "mitigated",
    date: Timestamp.fromDate(new Date()),
    affectedSystems: ["user-authentication"],
    reporter: "Automated Alert System",
    assignedTo: "Mary Johnson",
    remediation: "Account temporarily locked, awaiting user verification"
  },
  {
    title: "DDoS Attack",
    description: "Distributed denial of service attack targeting the main website",
    severity: "high",
    status: "resolved",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 5)), // 5 days ago
    affectedSystems: ["web-servers", "load-balancers"],
    reporter: "Network Monitoring",
    assignedTo: "Network Team",
    remediation: "Traffic filtering rules updated and CDN protections enhanced"
  },
  {
    title: "Data Leak from Development Database",
    description: "Test data containing scrambled but structurally similar production data was exposed via public API",
    severity: "medium",
    status: "resolved",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 7)), // 7 days ago
    affectedSystems: ["development-api", "test-database"],
    reporter: "Development Team Lead",
    assignedTo: "Data Security Team",
    remediation: "API access restricted, data sanitization process improved"
  },
  {
    title: "Malware Detection on Employee Workstation",
    description: "Endpoint protection detected and quarantined ransomware on marketing department computer",
    severity: "medium",
    status: "resolved",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 3)), // 3 days ago
    affectedSystems: ["endpoint-10054", "file-server-access"],
    reporter: "Endpoint Protection System",
    assignedTo: "IT Support",
    remediation: "Affected machine reimaged, user trained on security awareness"
  },
  {
    title: "Phishing Campaign Targeting Finance Department",
    description: "Sophisticated phishing emails impersonating the CEO requesting wire transfers",
    severity: "high",
    status: "mitigated",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 1.5)), // 1.5 days ago
    affectedSystems: ["email-gateway"],
    reporter: "Finance Director",
    assignedTo: "Security Awareness Team",
    remediation: "Warning sent to all staff, email filtering rules updated"
  },
  {
    title: "API Rate Limiting Bypass",
    description: "Detected attempts to circumvent API rate limiting by using multiple rotating API keys",
    severity: "medium",
    status: "investigating",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 0.5)), // 12 hours ago
    affectedSystems: ["api-gateway", "authentication-service"],
    reporter: "API Monitoring Alert",
    assignedTo: "Backend Development Team",
    remediation: "Implementing improved rate limiting that tracks usage patterns across keys"
  },
  {
    title: "S3 Bucket Misconfiguration",
    description: "Public read access accidentally enabled on internal document storage bucket",
    severity: "high",
    status: "resolved",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 6)), // 6 days ago
    affectedSystems: ["cloud-storage", "document-management"],
    reporter: "Cloud Security Scanner",
    assignedTo: "Cloud Infrastructure Team",
    remediation: "Permissions corrected, implemented mandatory access reviews for storage resources"
  },
  {
    title: "Git Repository Leaked Credentials",
    description: "AWS access keys committed to public GitHub repository",
    severity: "critical",
    status: "resolved",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 10)), // 10 days ago
    affectedSystems: ["development-environment", "cloud-access"],
    reporter: "Security Researcher",
    assignedTo: "Development Operations",
    remediation: "Keys rotated, implemented pre-commit hooks and secret scanning"
  }
];

// Sample threats data
const sampleThreats = [
  {
    title: "New Ransomware Variant Targeting Healthcare",
    description: "Intelligence indicates a new strain of ransomware specifically targeting healthcare providers",
    severity: "critical",
    category: "ransomware",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 1)), // 1 day ago
    status: "active",
    source: "Threat Intelligence Platform",
    impactAssessment: "Potentially severe impact on patient care systems",
    recommendedActions: "Update all systems, verify backups, conduct phishing awareness training"
  },
  {
    title: "Credential Stuffing Campaign",
    description: "Organized credential stuffing attacks using recent data breach information",
    severity: "high",
    category: "account-compromise",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 3)), // 3 days ago
    status: "active",
    source: "CERT Advisory",
    impactAssessment: "High risk to user accounts without MFA",
    recommendedActions: "Enforce MFA, implement progressive rate limiting, alert users to update passwords"
  },
  {
    title: "Zero-day Vulnerability in Apache Struts",
    description: "Unpatched vulnerability being actively exploited in the wild",
    severity: "critical",
    category: "zero-day",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 0.5)), // 12 hours ago
    status: "active",
    source: "US-CERT",
    impactAssessment: "Complete system compromise possible",
    recommendedActions: "Apply temporary mitigation measures while awaiting patch"
  },
  {
    title: "DDoS-for-Hire Services Targeting Financial Sector",
    description: "Criminal groups offering targeted DDoS services against financial institutions",
    severity: "medium",
    category: "ddos",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 5)), // 5 days ago
    status: "active",
    source: "FS-ISAC",
    impactAssessment: "Potential service disruptions during peak periods",
    recommendedActions: "Review DDoS protection measures, ensure incident response plans updated"
  },
  {
    title: "Supply Chain Compromise of Software Vendor",
    description: "Popular development tool vendor reports possible compromise of build system",
    severity: "high",
    category: "supply-chain",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 2)), // 2 days ago
    status: "investigating",
    source: "Vendor Security Advisory",
    impactAssessment: "Potential backdoor in applications using affected components",
    recommendedActions: "Audit systems using vendor software, monitor for unusual behavior"
  },
  {
    title: "State-Sponsored APT Targeting Critical Infrastructure",
    description: "Advanced persistent threat group linked to foreign government targeting utility systems",
    severity: "critical",
    category: "apt",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 7)), // 7 days ago
    status: "active",
    source: "National Security Advisory",
    impactAssessment: "Potential for operational disruption and data exfiltration",
    recommendedActions: "Apply recommended IoCs for detection, segment critical networks, increase monitoring"
  },
  {
    title: "Mobile Banking Trojan Campaign",
    description: "New Android malware targeting banking applications through fake app stores",
    severity: "medium",
    category: "malware",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 4)), // 4 days ago
    status: "active",
    source: "Mobile Security Vendor",
    impactAssessment: "Affects users on Android platforms who install from unofficial sources",
    recommendedActions: "Remind users to only install apps from official app stores, update mobile security guidance"
  },
  {
    title: "Cryptojacking Campaign Targeting Cloud Resources",
    description: "Attackers exploiting misconfigured cloud instances to mine cryptocurrency",
    severity: "medium",
    category: "cryptojacking",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 6)), // 6 days ago
    status: "active",
    source: "Cloud Security Alliance",
    impactAssessment: "Unexpected resource utilization and costs",
    recommendedActions: "Audit cloud resource configurations, implement proper access controls and monitoring"
  },
  {
    title: "Spear Phishing Campaign Against Executives",
    description: "Targeted phishing attacks against C-level executives using sophisticated social engineering",
    severity: "high",
    category: "phishing",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 1.5)), // 1.5 days ago
    status: "active",
    source: "Internal Security Team",
    impactAssessment: "Potential for high-privilege account compromise",
    recommendedActions: "Enhance email filtering rules, conduct executive security briefing, implement additional verification for sensitive requests"
  },
  {
    title: "DNS Hijacking Campaign",
    description: "Sophisticated attackers compromising DNS records to redirect traffic to malicious sites",
    severity: "high",
    category: "infrastructure",
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 8)), // 8 days ago
    status: "active",
    source: "Industry Security Group",
    impactAssessment: "Potential for credential theft and data interception",
    recommendedActions: "Implement DNS security extensions, enable multi-factor authentication for DNS management, monitor for unauthorized DNS changes"
  }
];

// Sample vulnerabilities data
const sampleVulnerabilities = [
  {
    title: "Cross-Site Scripting in Customer Portal",
    description: "Reflected XSS vulnerability allows attackers to inject scripts that execute in users' browsers",
    severity: "high",
    status: "open",
    dateDiscovered: Timestamp.fromDate(new Date(Date.now() - 86400000 * 2)), // 2 days ago
    affectedComponents: ["customer-portal", "profile-page"],
    cve: "N/A - Internally discovered",
    remediation: "Implement proper output encoding and content security policy",
    assignedTo: "Web Development Team",
    dueDate: Timestamp.fromDate(new Date(Date.now() + 86400000 * 5)), // 5 days from now
  },
  {
    title: "Outdated SSL/TLS Configuration",
    description: "Legacy TLS 1.0/1.1 protocols and weak ciphers still enabled on public-facing services",
    severity: "medium",
    status: "in-progress",
    dateDiscovered: Timestamp.fromDate(new Date(Date.now() - 86400000 * 10)), // 10 days ago
    affectedComponents: ["web-servers", "load-balancers"],
    cve: "N/A - Configuration issue",
    remediation: "Disable TLS 1.0/1.1 and weak cipher suites, enable only strong protocols",
    assignedTo: "Network Security Team",
    dueDate: Timestamp.fromDate(new Date(Date.now() + 86400000 * 2)), // 2 days from now
  },
  {
    title: "SQL Injection in Search Function",
    description: "Improper input validation allows for SQL injection in product search functionality",
    severity: "critical",
    status: "open",
    dateDiscovered: Timestamp.fromDate(new Date(Date.now() - 86400000 * 1)), // 1 day ago
    affectedComponents: ["search-api", "product-database"],
    cve: "N/A - Internally discovered",
    remediation: "Implement prepared statements and parametrized queries",
    assignedTo: "Backend Development Team",
    dueDate: Timestamp.fromDate(new Date(Date.now() + 86400000 * 1)), // 1 day from now
  },
  {
    title: "Server Missing Critical Security Patches",
    description: "Production application servers missing multiple critical OS security patches",
    severity: "high",
    status: "open",
    dateDiscovered: Timestamp.fromDate(new Date(Date.now() - 86400000 * 3)), // 3 days ago
    affectedComponents: ["app-server-cluster"],
    cve: "Multiple",
    remediation: "Apply security patches during next maintenance window",
    assignedTo: "System Administration",
    dueDate: Timestamp.fromDate(new Date(Date.now() + 86400000 * 7)), // 7 days from now
  },
  {
    title: "Weak Password Policy",
    description: "Current password policy does not enforce sufficient complexity or rotation",
    severity: "medium",
    status: "in-progress",
    dateDiscovered: Timestamp.fromDate(new Date(Date.now() - 86400000 * 15)), // 15 days ago
    affectedComponents: ["authentication-system", "user-management"],
    cve: "N/A - Policy issue",
    remediation: "Implement stronger password requirements and regular rotation",
    assignedTo: "Identity Management Team",
    dueDate: Timestamp.fromDate(new Date(Date.now() + 86400000 * 10)), // 10 days from now
  },
  {
    title: "Insecure Direct Object References",
    description: "Application allows access to objects based on user-supplied input without verification",
    severity: "high",
    status: "open",
    dateDiscovered: Timestamp.fromDate(new Date(Date.now() - 86400000 * 5)), // 5 days ago
    affectedComponents: ["document-management", "file-api"],
    cve: "N/A - Internally discovered",
    remediation: "Implement proper access controls and indirect reference maps",
    assignedTo: "Application Security Team",
    dueDate: Timestamp.fromDate(new Date(Date.now() + 86400000 * 4)), // 4 days from now
  },
  {
    title: "Log4j Vulnerability (Log4Shell)",
    description: "Systems using Log4j 2.0-2.14.1 vulnerable to remote code execution",
    severity: "critical",
    status: "in-progress",
    dateDiscovered: Timestamp.fromDate(new Date(Date.now() - 86400000 * 8)), // 8 days ago
    affectedComponents: ["logging-framework", "multiple-services"],
    cve: "CVE-2021-44228",
    remediation: "Upgrade Log4j to version 2.15.0 or higher",
    assignedTo: "DevOps Team",
    dueDate: Timestamp.fromDate(new Date(Date.now() + 86400000 * 1)), // 1 day from now
  },
  {
    title: "Unencrypted Data Storage",
    description: "Certain sensitive configuration data stored in plaintext",
    severity: "high",
    status: "open",
    dateDiscovered: Timestamp.fromDate(new Date(Date.now() - 86400000 * 4)), // 4 days ago
    affectedComponents: ["configuration-management", "credential-storage"],
    cve: "N/A - Security best practice violation",
    remediation: "Implement encryption for sensitive configuration data and secrets management",
    assignedTo: "Security Architecture Team",
    dueDate: Timestamp.fromDate(new Date(Date.now() + 86400000 * 6)), // 6 days from now
  },
  {
    title: "Cross-Site Request Forgery in Admin Panel",
    description: "Admin functions vulnerable to CSRF attacks due to lack of anti-CSRF tokens",
    severity: "medium",
    status: "open",
    dateDiscovered: Timestamp.fromDate(new Date(Date.now() - 86400000 * 7)), // 7 days ago
    affectedComponents: ["admin-interface", "user-management"],
    cve: "N/A - Internally discovered",
    remediation: "Implement anti-CSRF tokens for all state-changing operations",
    assignedTo: "Web Development Team",
    dueDate: Timestamp.fromDate(new Date(Date.now() + 86400000 * 8)), // 8 days from now
  },
  {
    title: "Outdated jQuery Library with Known Vulnerabilities",
    description: "Website using jQuery version with multiple known security issues",
    severity: "medium",
    status: "open",
    dateDiscovered: Timestamp.fromDate(new Date(Date.now() - 86400000 * 6)), // 6 days ago
    affectedComponents: ["frontend-application", "customer-portal"],
    cve: "Multiple",
    remediation: "Update jQuery to latest version and implement dependency management",
    assignedTo: "Frontend Development Team",
    dueDate: Timestamp.fromDate(new Date(Date.now() + 86400000 * 9)), // 9 days from now
  }
];

const DbSeeder: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("incidents");

  // Function to seed incidents
  const seedIncidents = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    
    try {
      const incidentsCollection = collection(db, "incidents");
      
      // Add each incident to Firestore
      for (const incident of sampleIncidents) {
        await addDoc(incidentsCollection, incident);
      }
      
      setSuccess("Incidents seeded successfully!");
    } catch (err) {
      console.error("Error seeding incidents:", err);
      setError(`Error seeding incidents: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to seed threats
  const seedThreats = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    
    try {
      const threatsCollection = collection(db, "threats");
      
      // Add each threat to Firestore
      for (const threat of sampleThreats) {
        await addDoc(threatsCollection, threat);
      }
      
      setSuccess("Threats seeded successfully!");
    } catch (err) {
      console.error("Error seeding threats:", err);
      setError(`Error seeding threats: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to seed vulnerabilities
  const seedVulnerabilities = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    
    try {
      const vulnerabilitiesCollection = collection(db, "vulnerabilities");
      
      // Add each vulnerability to Firestore
      for (const vulnerability of sampleVulnerabilities) {
        await addDoc(vulnerabilitiesCollection, vulnerability);
      }
      
      setSuccess("Vulnerabilities seeded successfully!");
    } catch (err) {
      console.error("Error seeding vulnerabilities:", err);
      setError(`Error seeding vulnerabilities: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Seed all data
  const seedAll = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    
    try {
      await seedIncidents();
      await seedThreats();
      await seedVulnerabilities();
      
      setSuccess("All data seeded successfully!");
    } catch (err) {
      console.error("Error seeding all data:", err);
      setError(`Error seeding all data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Database Seeder</h1>
      
      <Tabs defaultValue="incidents" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="incidents">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Seed Incidents</h2>
              <p className="text-gray-500 mb-4">
                This will add {sampleIncidents.length} sample incidents to the database.
              </p>
              <Button 
                onClick={seedIncidents} 
                disabled={loading}
                className="w-full"
              >
                {loading && activeTab === "incidents" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Seeding Incidents...
                  </>
                ) : (
                  "Seed Incidents"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="threats">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Seed Threats</h2>
              <p className="text-gray-500 mb-4">
                This will add {sampleThreats.length} sample threats to the database.
              </p>
              <Button 
                onClick={seedThreats} 
                disabled={loading}
                className="w-full"
              >
                {loading && activeTab === "threats" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Seeding Threats...
                  </>
                ) : (
                  "Seed Threats"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vulnerabilities">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Seed Vulnerabilities</h2>
              <p className="text-gray-500 mb-4">
                This will add {sampleVulnerabilities.length} sample vulnerabilities to the database.
              </p>
              <Button 
                onClick={seedVulnerabilities} 
                disabled={loading}
                className="w-full"
              >
                {loading && activeTab === "vulnerabilities" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Seeding Vulnerabilities...
                  </>
                ) : (
                  "Seed Vulnerabilities"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-2">Seed All Data</h2>
            <p className="text-gray-500 mb-4">
              This will add all sample data to the database (incidents, threats, and vulnerabilities).
            </p>
            <Button 
              onClick={seedAll} 
              disabled={loading}
              className="w-full"
              variant="default"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding All Data...
                </>
              ) : (
                "Seed All Data"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {success && (
        <Alert className="mt-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">
            {success}
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert className="mt-4 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DbSeeder; 