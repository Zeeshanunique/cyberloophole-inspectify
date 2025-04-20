import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { getFirestore, collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart } from '@/components/ui/chart';

const Landing = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalIncidents: 0,
    criticalIncidents: 0,
    sectorsAffected: 0,
    latestIncident: null
  });
  const [loading, setLoading] = useState(true);
  const [severityData, setSeverityData] = useState(null);

  // Fetch real-time stats from Firebase
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const db = getFirestore();
        const incidentsRef = collection(db, 'incidents');
        
        // Get all incidents
        const incidentsSnapshot = await getDocs(incidentsRef);
        
        // Count by severity and collect sectors
        const severityCounts = { low: 0, medium: 0, high: 0, critical: 0 };
        const sectors = new Set();
        let latestIncident = null;
        
        incidentsSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.severity && severityCounts.hasOwnProperty(data.severity)) {
            severityCounts[data.severity]++;
          }
          
          if (data.sector) {
            sectors.add(data.sector);
          }
          
          // Track the latest incident for preview
          if (!latestIncident || (data.date && data.date.toDate() > latestIncident.date.toDate())) {
            latestIncident = { id: doc.id, ...data };
          }
        });
        
        // Set stats
        setStats({
          totalIncidents: incidentsSnapshot.size,
          criticalIncidents: severityCounts.critical,
          sectorsAffected: sectors.size,
          latestIncident
        });
        
        // Prepare severity chart data
        setSeverityData({
          labels: ['Low', 'Medium', 'High', 'Critical'],
          datasets: [
            {
              label: 'Incidents by Severity',
              data: [severityCounts.low, severityCounts.medium, severityCounts.high, severityCounts.critical],
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',  // Low - Green
                'rgba(255, 206, 86, 0.6)',  // Medium - Yellow
                'rgba(255, 159, 64, 0.6)',  // High - Orange
                'rgba(255, 99, 132, 0.6)',  // Critical - Red
              ],
            },
          ],
        });
        
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // Function to get severity badge color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-cyberdark">
      {/* Hero Section */}
      <section className="relative">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/90 z-0"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center z-[-1]" 
          style={{ 
            backgroundImage: "url('/images/cyber-bg.jpg')", 
            backgroundBlendMode: "overlay" 
          }}
        ></div>
        
        <div className="container mx-auto px-4 py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Protecting India's Critical Information Infrastructure
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl">
              Real-time cyber threat intelligence platform for monitoring, analyzing, and responding to cyber incidents in Indian cyberspace.
            </p>
            <div className="flex flex-wrap gap-4">
              {currentUser ? (
                <Button asChild size="lg" className="bg-cyberblue-500 hover:bg-cyberblue-600 text-white">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-cyberblue-500 hover:bg-cyberblue-600 text-white">
                    <Link to="/login">Log In</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="text-black border-white hover:bg-white/10">
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </>
              )}                           
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Section - NEW */}
      <section className="py-16 bg-cybergray-50 dark:bg-cyberdark-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-cybergray-900 dark:text-white mb-4">
              Live Cyber Threat Intelligence
            </h2>
            <p className="text-xl text-cybergray-600 dark:text-cybergray-400 max-w-3xl mx-auto">
              Real-time analytics from our database of cyber incidents affecting Indian infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Stat Cards */}
            <Card className="p-6 bg-white dark:bg-cyberdark-700 shadow-md">
              <CardContent className="p-0">
                <h3 className="text-sm font-semibold text-cybergray-500 dark:text-cybergray-400 mb-2">Total Incidents</h3>
                {loading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <div className="text-3xl font-bold text-cybergray-900 dark:text-white">
                    {stats.totalIncidents}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="p-6 bg-white dark:bg-cyberdark-700 shadow-md">
              <CardContent className="p-0">
                <h3 className="text-sm font-semibold text-cybergray-500 dark:text-cybergray-400 mb-2">Critical Incidents</h3>
                {loading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {stats.criticalIncidents}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="p-6 bg-white dark:bg-cyberdark-700 shadow-md">
              <CardContent className="p-0">
                <h3 className="text-sm font-semibold text-cybergray-500 dark:text-cybergray-400 mb-2">Sectors Affected</h3>
                {loading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <div className="text-3xl font-bold text-cybergray-900 dark:text-white">
                    {stats.sectorsAffected}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="p-6 bg-white dark:bg-cyberdark-700 shadow-md">
              <CardContent className="p-0">
                <h3 className="text-sm font-semibold text-cybergray-500 dark:text-cybergray-400 mb-2">View Analytics</h3>
                <Button asChild className="w-full mt-2">
                  <Link to="/analytics">Explore Data</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Analytics Preview */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-white dark:bg-cyberdark-700 shadow-md h-full">
                <CardContent className="p-0">
                  <h3 className="text-xl font-semibold text-cybergray-900 dark:text-white mb-4">Incidents by Severity</h3>
                  {loading || !severityData ? (
                    <div className="h-64 flex items-center justify-center">
                      <Skeleton className="h-48 w-48 rounded-full" />
                    </div>
                  ) : (
                    <div className="h-[250px] w-full">
                      <PieChart data={severityData} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card className="p-6 bg-white dark:bg-cyberdark-700 shadow-md h-full">
                <CardContent className="p-0">
                  <h3 className="text-xl font-semibold text-cybergray-900 dark:text-white mb-4">Latest Incident</h3>
                  {loading || !stats.latestIncident ? (
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-medium text-cybergray-900 dark:text-white">
                          {stats.latestIncident.title}
                        </h4>
                        {stats.latestIncident.severity && (
                          <Badge className={getSeverityColor(stats.latestIncident.severity)}>
                            {stats.latestIncident.severity.charAt(0).toUpperCase() + stats.latestIncident.severity.slice(1)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-cybergray-600 dark:text-cybergray-400 mb-4 line-clamp-3">
                        {stats.latestIncident.description}
                      </p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-cybergray-500 dark:text-cybergray-500">
                          Sector: {stats.latestIncident.sector || 'N/A'}
                        </span>
                        <span className="text-cybergray-500 dark:text-cybergray-500">
                          {stats.latestIncident.date && stats.latestIncident.date.toDate().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <Button asChild className="mt-4 w-full" variant="outline">
                        <Link to="/incidents">View All Incidents</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-cyberdark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-cybergray-900 dark:text-white mb-4">
              Comprehensive Cyber Threat Intelligence
            </h2>
            <p className="text-xl text-cybergray-600 dark:text-cybergray-400 max-w-3xl mx-auto">
              Our platform leverages advanced machine learning to collect, analyze, and visualize cyber threats targeting Indian infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-cyberdark-700 rounded-xl shadow-md p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 16h5v5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-cybergray-900 dark:text-white mb-2">
                Automated Data Collection
              </h3>
              <p className="text-cybergray-600 dark:text-cybergray-400">
                Continuously monitors forums, paste sites, social media, and developer platforms to collect cyber incident data relevant to Indian cyberspace.
              </p>
            </div>

            <div className="bg-white dark:bg-cyberdark-700 rounded-xl shadow-md p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                  <path d="M13 5v2" />
                  <path d="M13 17v2" />
                  <path d="M13 11v2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-cybergray-900 dark:text-white mb-2">
                Machine Learning Analysis
              </h3>
              <p className="text-cybergray-600 dark:text-cybergray-400">
                Advanced ML models identify patterns, categorize threats, and predict potential vulnerabilities in critical infrastructure.
              </p>
            </div>

            <div className="bg-white dark:bg-cyberdark-700 rounded-xl shadow-md p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-cybergray-900 dark:text-white mb-2">
                Visual Intelligence
              </h3>
              <p className="text-cybergray-600 dark:text-cybergray-400">
                Interactive dashboards and visualizations provide sector-specific insights, APT tracking, and strategic intelligence for decision-makers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About NCIIPC Section */}
      <section className="py-20 bg-white dark:bg-cyberdark">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="/images/nciipc-logo.png" 
                alt="NCIIPC" 
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/500x300?text=NCIIPC';
                }}
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-cybergray-900 dark:text-white mb-4">
                About NCIIPC
              </h2>
              <p className="text-lg text-cybergray-600 dark:text-cybergray-400 mb-6">
                The National Critical Information Infrastructure Protection Centre (NCIIPC) is an organization created under Section 70A of the Information Technology Act, 2000 (amended 2008), and is designated as the National Nodal Agency for the protection of critical information infrastructure.
              </p>
              <p className="text-lg text-cybergray-600 dark:text-cybergray-400 mb-6">
                NCIIPC's mandate is to facilitate safe, secure and resilient Information Infrastructure for Critical Sectors of the Nation. It aims to protect the nation's critical information infrastructure from unauthorized access, modification, use, disclosure, disruption, incapacitation or destruction.
              </p>
              <Button asChild className="bg-cyberblue-500 hover:bg-cyberblue-600 text-white">
                <a href="https://nciipc.gov.in/" target="_blank" rel="noopener noreferrer">
                  Learn More About NCIIPC
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="py-16 bg-gradient-to-r from-cyberblue-600 to-cyberblue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Strengthen India's Cyber Defense?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our platform to access real-time cyber threat intelligence and contribute to protecting India's critical information infrastructure.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {currentUser ? (
              <>
                <Button asChild size="lg" className="bg-white text-cyberblue-600 hover:bg-gray-100">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-black hover:bg-white/20">
                  <Link to="/incidents">View Incidents</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="bg-cyberblue-600 text-white hover:bg-cyberblue-700">
                  <Link to="/signup">Create Account</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-black hover:bg-white/10">
                  <Link to="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cyberdark-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CyberLoophole Inspectify</h3>
              <p className="text-cybergray-400">
                A comprehensive platform for monitoring and analyzing cyber incidents in Indian cyberspace.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-cybergray-400 hover:text-white">Home</Link></li>
                <li><Link to="/dashboard" className="text-cybergray-400 hover:text-white">Dashboard</Link></li>
                <li><Link to="/incidents" className="text-cybergray-400 hover:text-white">Incidents</Link></li>
                <li><Link to="/analytics" className="text-cybergray-400 hover:text-white">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-cybergray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-cybergray-400 hover:text-white">API</a></li>
                <li><a href="#" className="text-cybergray-400 hover:text-white">Support</a></li>
                <li><a href="#" className="text-cybergray-400 hover:text-white">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-cybergray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-cybergray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-cybergray-400 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-cybergray-500">
            <p>&copy; {new Date().getFullYear()} CyberLoophole Inspectify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;