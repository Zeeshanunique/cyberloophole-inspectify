
import { Shield, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { CyberIncident } from "../utils/mockData";

interface PreventiveActionsProps {
  incident: CyberIncident;
}

const PreventiveActions = ({ incident }: PreventiveActionsProps) => {
  // Additional recommendations based on incident category
  const getAdditionalRecommendations = () => {
    switch (incident.category) {
      case "API Security":
        return [
          "Implement OAuth 2.0 and OpenID Connect for secure authentication",
          "Use API gateways with request throttling and quota management",
          "Perform regular API security audits and penetration testing",
          "Implement proper input validation and output encoding",
          "Adopt a zero-trust security model for API access"
        ];
      case "Phishing":
        return [
          "Deploy advanced email filtering solutions",
          "Implement DMARC, SPF, and DKIM email authentication",
          "Conduct regular phishing awareness training for employees",
          "Use browser isolation technologies for high-risk users",
          "Implement URL reputation checking for all incoming links"
        ];
      case "DDoS":
        return [
          "Deploy cloud-based DDoS protection services",
          "Implement anycast network addressing",
          "Overprovision bandwidth to absorb volumetric attacks",
          "Configure rate limiting at network perimeter",
          "Develop and test a DDoS response playbook"
        ];
      case "Data Breach":
        return [
          "Implement data loss prevention (DLP) solutions",
          "Apply data encryption at rest and in transit",
          "Adopt a comprehensive data classification scheme",
          "Enforce least privilege access controls",
          "Perform regular data security assessments"
        ];
      case "Ransomware":
        return [
          "Maintain secure, offline backups of critical data",
          "Implement application whitelisting",
          "Segment networks to prevent lateral movement",
          "Deploy advanced endpoint protection with behavioral analysis",
          "Develop a ransomware incident response plan"
        ];
      case "Supply Chain Attack":
        return [
          "Implement software bill of materials (SBOM)",
          "Perform vendor security assessments",
          "Use code signing for all software components",
          "Monitor third-party software behavior with EDR solutions",
          "Enforce separation of duties for critical systems"
        ];
      case "Web Application Security":
        return [
          "Implement a web application firewall (WAF)",
          "Conduct regular security code reviews and penetration testing",
          "Use content security policy (CSP) headers",
          "Adopt secure coding practices and frameworks",
          "Automate security testing in CI/CD pipelines"
        ];
      default:
        return [
          "Implement a comprehensive security awareness program",
          "Deploy defense-in-depth security architecture",
          "Establish a security operations center (SOC)",
          "Adopt a formal vulnerability management process",
          "Implement continuous security monitoring"
        ];
    }
  };

  const additionalRecommendations = getAdditionalRecommendations();

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mr-4">
          <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-cybergray-900 dark:text-white">
          Preventive Measures & Recommendations
        </h3>
      </div>

      <div className="cyber-card p-4 mb-6">
        <h4 className="text-lg font-medium text-cybergray-900 dark:text-white mb-3">Specified Preventive Actions</h4>
        <ul className="space-y-3">
          {incident.preventiveMeasures.map((measure, index) => (
            <li key={index} className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-cybergray-700 dark:text-cybergray-300">{measure}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="cyber-card p-4 mb-6">
        <h4 className="text-lg font-medium text-cybergray-900 dark:text-white mb-3">Additional Recommendations</h4>
        <p className="text-cybergray-600 dark:text-cybergray-400 mb-4">
          Based on the incident analysis, we recommend the following additional measures specific to {incident.category} threats:
        </p>
        <ul className="space-y-3">
          {additionalRecommendations.map((recommendation, index) => (
            <li key={index} className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-cyberblue-500 flex-shrink-0 mt-0.5" />
              <span className="text-cybergray-700 dark:text-cybergray-300">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="cyber-card p-4">
        <h4 className="text-lg font-medium text-cybergray-900 dark:text-white mb-3">Implementation Strategy</h4>
        <div className="space-y-4">
          <div>
            <h5 className="text-base font-medium text-cybergray-800 dark:text-cybergray-200 mb-2 flex items-center">
              <span className="inline-block h-2 w-2 bg-cyberalert-high rounded-full mr-2"></span>
              Immediate Actions (0-30 days)
            </h5>
            <ul className="space-y-2 pl-4">
              <li className="text-cybergray-700 dark:text-cybergray-300">
                Implement critical patches and security updates
              </li>
              <li className="text-cybergray-700 dark:text-cybergray-300">
                Review and update access controls
              </li>
              <li className="text-cybergray-700 dark:text-cybergray-300">
                Conduct emergency security awareness training for employees
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-base font-medium text-cybergray-800 dark:text-cybergray-200 mb-2 flex items-center">
              <span className="inline-block h-2 w-2 bg-cyberalert-medium rounded-full mr-2"></span>
              Short-Term Measures (30-90 days)
            </h5>
            <ul className="space-y-2 pl-4">
              <li className="text-cybergray-700 dark:text-cybergray-300">
                Deploy additional security monitoring tools
              </li>
              <li className="text-cybergray-700 dark:text-cybergray-300">
                Implement advanced threat protection solutions
              </li>
              <li className="text-cybergray-700 dark:text-cybergray-300">
                Conduct comprehensive security assessment
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-base font-medium text-cybergray-800 dark:text-cybergray-200 mb-2 flex items-center">
              <span className="inline-block h-2 w-2 bg-cyberalert-low rounded-full mr-2"></span>
              Long-Term Strategy (90+ days)
            </h5>
            <ul className="space-y-2 pl-4">
              <li className="text-cybergray-700 dark:text-cybergray-300">
                Develop comprehensive security architecture
              </li>
              <li className="text-cybergray-700 dark:text-cybergray-300">
                Implement continuous security improvement program
              </li>
              <li className="text-cybergray-700 dark:text-cybergray-300">
                Establish regular security drills and tabletop exercises
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreventiveActions;
