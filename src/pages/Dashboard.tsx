import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getFirestore, collection, query, getDocs, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
import DbSeeder from '../components/DbSeeder';
import { PlusCircle, Globe, Scan, ShieldAlert } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import CybercrimeDetectionForm from '../components/WebLinkAnalysisForm';
import CybercrimeDetectionResults from '../components/WebLinkAnalysisResults';

// Types for our data
interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  sector: string;
  source: string;
  date: Timestamp;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  affectedSystems?: string[];
  attackVector?: string;
  threatActors?: string[];
}

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [incidentsBySector, setIncidentsBySector] = useState<{[key: string]: number}>({});
  const [incidentsBySeverity, setIncidentsBySeverity] = useState<{[key: string]: number}>({});
  const [incidentTrend, setIncidentTrend] = useState<{date: string, count: number}[]>([]);
  const [attackVectors, setAttackVectors] = useState<{[key: string]: number}>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCybercrimeDetectionDialog, setShowCybercrimeDetectionDialog] = useState(false);
  const [webLinkAnalysisRefreshKey, setWebLinkAnalysisRefreshKey] = useState(0);

  useEffect(() => {
    // Check if the current user is an admin
    if (currentUser?.email) {
      const adminEmails = ['admin@example.com', 'test@example.com']; 
      setIsAdmin(adminEmails.includes(currentUser.email));
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const db = getFirestore();
        
        // Fetch recent incidents
        const incidentsRef = collection(db, 'incidents');
        const recentQuery = query(incidentsRef, orderBy('date', 'desc'), limit(5));
        const incidentsSnapshot = await getDocs(recentQuery);
        
        const incidents: Incident[] = [];
        incidentsSnapshot.forEach(doc => {
          incidents.push({ id: doc.id, ...doc.data() } as Incident);
        });
        
        setRecentIncidents(incidents);
        
        // Calculate incidents by sector
        const sectorMap: {[key: string]: number} = {};
        const severityMap: {[key: string]: number} = {};
        const attackVectorMap: {[key: string]: number} = {};
        
        // Get all incidents for statistics
        const allIncidentsQuery = query(incidentsRef);
        const allIncidentsSnapshot = await getDocs(allIncidentsQuery);
        
        allIncidentsSnapshot.forEach(doc => {
          const data = doc.data() as Incident;
          
          // Count by sector
          if (data.sector) {
            sectorMap[data.sector] = (sectorMap[data.sector] || 0) + 1;
          }
          
          // Count by severity
          if (data.severity) {
            severityMap[data.severity] = (severityMap[data.severity] || 0) + 1;
          }
          
          // Count by attack vector
          if (data.attackVector) {
            attackVectorMap[data.attackVector] = (attackVectorMap[data.attackVector] || 0) + 1;
          }
        });
        
        setIncidentsBySector(sectorMap);
        setIncidentsBySeverity(severityMap);
        setAttackVectors(attackVectorMap);
        
        // Generate incident trend data (last 7 days)
        const trend: {date: string, count: number}[] = [];
        const now = new Date();
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          
          const startOfDay = new Date(date.setHours(0, 0, 0, 0));
          const endOfDay = new Date(date.setHours(23, 59, 59, 999));
          
          const dailyQuery = query(
            incidentsRef,
            where('date', '>=', Timestamp.fromDate(startOfDay)),
            where('date', '<=', Timestamp.fromDate(endOfDay))
          );
          
          const dailySnapshot = await getDocs(dailyQuery);
          
          trend.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            count: dailySnapshot.size
          });
        }
        
        setIncidentTrend(trend);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [refreshKey]);

  // Function to handle adding data
  const handleAddData = () => {
    navigate('/incidents/add');
  };

  const refreshData = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleOpenCybercrimeDetection = () => {
    setShowCybercrimeDetectionDialog(true);
  };

  const handleCybercrimeDetectionComplete = () => {
    setShowCybercrimeDetectionDialog(false);
    setWebLinkAnalysisRefreshKey(prev => prev + 1);
  };

  // Prepare chart data
  const sectorChartData = {
    labels: Object.keys(incidentsBySector),
    datasets: [
      {
        label: 'Incidents by Sector',
        data: Object.values(incidentsBySector),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  const severityChartData = {
    labels: Object.keys(incidentsBySeverity).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    datasets: [
      {
        label: 'Incidents by Severity',
        data: Object.values(incidentsBySeverity),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Low - Green
          'rgba(255, 206, 86, 0.6)', // Medium - Yellow
          'rgba(255, 159, 64, 0.6)', // High - Orange
          'rgba(255, 99, 132, 0.6)', // Critical - Red
        ],
      },
    ],
  };

  const trendChartData = {
    labels: incidentTrend.map(item => item.date),
    datasets: [
      {
        label: 'Daily Incidents',
        data: incidentTrend.map(item => item.count),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // New chart for attack vectors
  const attackVectorsData = {
    labels: Object.keys(attackVectors).slice(0, 5), // Show top 5 vectors
    datasets: [
      {
        label: 'Attack Vectors',
        data: Object.values(attackVectors).slice(0, 5),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      }
    ]
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cybergray-50 dark:bg-cyberdark">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-cybergray-900 dark:text-white">
                Welcome, {currentUser?.displayName || 'User'}
              </h1>
              <p className="text-cybergray-600 dark:text-cybergray-400">
                Here's your cyber threat intelligence overview
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={refreshData}
                className="flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                  <path d="M16 16h5v5"></path>
                </svg>
                Refresh Data
              </Button>
              <Button 
                onClick={handleOpenCybercrimeDetection}
                className="bg-cyberblue-600 hover:bg-cyberblue-700 text-white"
              >
                <Scan className="mr-2 h-4 w-4" />
                Cybercrime Detect
              </Button>
              <Button 
                onClick={handleAddData}
                className="bg-cyberblue-500 hover:bg-cyberblue-600 text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Incident
              </Button>
            </div>
          </div>
          
          {/* Admin Database Controls */}
          {isAdmin && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Database Administration</CardTitle>
                <CardDescription>
                  Manage database collections and seed test data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DbSeeder />
              </CardContent>
            </Card>
          )}
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-cybergray-500 dark:text-cybergray-400">
                  Total Incidents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  <div className="text-2xl font-bold text-cybergray-900 dark:text-white">
                    {Object.values(incidentsBySector).reduce((a, b) => a + b, 0)}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-cybergray-500 dark:text-cybergray-400">
                  Critical Incidents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {incidentsBySeverity['critical'] || 0}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-cybergray-500 dark:text-cybergray-400">
                  Sectors Affected
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  <div className="text-2xl font-bold text-cybergray-900 dark:text-white">
                    {Object.keys(incidentsBySector).length}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-cybergray-500 dark:text-cybergray-400">
                  New Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  <div className="text-2xl font-bold text-cyberblue-600 dark:text-cyberblue-400">
                    {incidentTrend[incidentTrend.length - 1]?.count || 0}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white dark:bg-cyberdark-700 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Incident Trend (7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <Skeleton className="h-48 w-full" />
                  </div>
                ) : (
                  <div className="h-[250px] w-full">
                    <LineChart data={trendChartData} />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-cyberdark-700 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Incidents by Sector</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-64 flex items-center justify-center">
                      <Skeleton className="h-48 w-full" />
                    </div>
                  ) : (
                    <div className="h-[250px] w-full">
                      <PieChart data={sectorChartData} />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-cyberdark-700 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Incidents by Severity</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-64 flex items-center justify-center">
                      <Skeleton className="h-48 w-full" />
                    </div>
                  ) : (
                    <div className="h-[250px] w-full">
                      <PieChart data={severityChartData} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white dark:bg-cyberdark-700 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Top Attack Vectors</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <Skeleton className="h-48 w-full" />
                  </div>
                ) : (
                  <div className="h-[250px] w-full">
                    <BarChart data={attackVectorsData} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Cybercrime Detection Dialog */}
          <Dialog open={showCybercrimeDetectionDialog} onOpenChange={setShowCybercrimeDetectionDialog}>
            <DialogContent className="max-w-xl">
              <DialogTitle className="sr-only">Cybercrime Detection</DialogTitle>
              <CybercrimeDetectionForm 
                onAnalysisComplete={handleCybercrimeDetectionComplete} 
                onCancel={() => setShowCybercrimeDetectionDialog(false)} 
              />
            </DialogContent>
          </Dialog>

          {/* Cybercrime Detection Results Section */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <ShieldAlert className="mr-2 h-5 w-5 text-cyberblue-500" />
                  Cybercrime Detection Results
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setWebLinkAnalysisRefreshKey(prev => prev + 1)}
                  className="text-cyberblue-500"
                >
                  Refresh
                </Button>
              </div>
              <CardDescription>
                AI-powered detection of cybercrime in websites and social media
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CybercrimeDetectionResults refreshTrigger={webLinkAnalysisRefreshKey} />
            </CardContent>
          </Card>

          {/* Recent Incidents */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Incidents</CardTitle>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/incidents">View All</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-cyberblue-500 hover:bg-cyberblue-600 text-white">
                    <Link to="/incidents/add">Add New</Link>
                  </Button>
                </div>
              </div>
              <CardDescription>
                The latest cyber incidents affecting Indian infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentIncidents.length > 0 ? (
                    recentIncidents.map(incident => (
                      <div key={incident.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-cybergray-900 dark:text-white">
                            {incident.title}
                          </h3>
                          <Badge className={getSeverityColor(incident.severity)}>
                            {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-cybergray-600 dark:text-cybergray-400 mb-2 line-clamp-2">
                          {incident.description}
                        </p>
                        <div className="flex justify-between items-center text-xs text-cybergray-500 dark:text-cybergray-500">
                          <span>Sector: {incident.sector}</span>
                          <span>
                            {incident.date.toDate().toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-cybergray-500 dark:text-cybergray-400">
                      No incidents found. Start by adding some data.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;