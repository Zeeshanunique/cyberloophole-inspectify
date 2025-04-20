import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, LineChart, PieChart, RadarChart } from '@/components/ui/chart';
import analyticsService, { AnalyticsData, TimeRange } from '@/services/AnalyticsService';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('1y');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    incidentsBySector: {},
    incidentsBySeverity: {},
    incidentsByAttackVector: {},
    incidentsByMonth: {},
    incidentsByThreatActor: {},
    sectorVulnerabilityMatrix: { labels: [], datasets: [] }
  });
  
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getAnalyticsData(timeRange);
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [timeRange]);
  
  // Prepare chart data
  const sectorChartData = {
    labels: Object.keys(analyticsData.incidentsBySector),
    datasets: [
      {
        label: 'Incidents by Sector',
        data: Object.values(analyticsData.incidentsBySector),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(201, 203, 207, 0.6)',
        ],
      },
    ],
  };
  
  const severityChartData = {
    labels: Object.keys(analyticsData.incidentsBySeverity).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    datasets: [
      {
        label: 'Incidents by Severity',
        data: Object.values(analyticsData.incidentsBySeverity),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Low - Green
          'rgba(255, 206, 86, 0.6)', // Medium - Yellow
          'rgba(255, 159, 64, 0.6)', // High - Orange
          'rgba(255, 99, 132, 0.6)', // Critical - Red
        ],
      },
    ],
  };
  
  const attackVectorChartData = {
    labels: Object.keys(analyticsData.incidentsByAttackVector),
    datasets: [
      {
        label: 'Incidents by Attack Vector',
        data: Object.values(analyticsData.incidentsByAttackVector),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
    ],
  };
  
  const monthlyTrendChartData = {
    labels: Object.keys(analyticsData.incidentsByMonth),
    datasets: [
      {
        label: 'Monthly Incidents',
        data: Object.values(analyticsData.incidentsByMonth),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
    ],
  };
  
  const threatActorChartData = {
    labels: Object.keys(analyticsData.incidentsByThreatActor).slice(0, 10), // Top 10
    datasets: [
      {
        label: 'Incidents by Threat Actor',
        data: Object.values(analyticsData.incidentsByThreatActor).slice(0, 10), // Top 10
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1,
      },
    ],
  };
  
  const sectorVulnerabilityChartData = {
    labels: analyticsData.sectorVulnerabilityMatrix.labels,
    datasets: analyticsData.sectorVulnerabilityMatrix.datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: `rgba(${index * 50}, ${255 - index * 30}, ${150}, 0.2)`,
      borderColor: `rgba(${index * 50}, ${255 - index * 30}, ${150}, 1)`,
      pointBackgroundColor: `rgba(${index * 50}, ${255 - index * 30}, ${150}, 1)`,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: `rgba(${index * 50}, ${255 - index * 30}, ${150}, 1)`,
    })),
  };

  // Helper functions that use the AnalyticsService
  const getTrendAnalysis = () => {
    if (Object.keys(analyticsData.incidentsByMonth).length <= 1) {
      return "Insufficient time-series data available for trend analysis.";
    }
    return analyticsService.getTrendAnalysis(analyticsData.incidentsByMonth);
  };

  const getRecommendations = () => {
    return analyticsService.getStrategicRecommendations(analyticsData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cybergray-50 dark:bg-cyberdark">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-cybergray-900 dark:text-white mb-2">
                Analytics & Insights
              </h1>
              <p className="text-cybergray-600 dark:text-cybergray-400">
                Visual representation of cyber incidents affecting Indian infrastructure
              </p>
            </div>
            
            <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="h-full">
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
                    {Object.values(analyticsData.incidentsBySector).reduce((a, b) => a + b, 0)}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="h-full">
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
                    {Object.keys(analyticsData.incidentsBySector).length}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-cybergray-500 dark:text-cybergray-400">
                  Attack Vectors
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  <div className="text-2xl font-bold text-cybergray-900 dark:text-white">
                    {Object.keys(analyticsData.incidentsByAttackVector).length}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-cybergray-500 dark:text-cybergray-400">
                  Threat Actors
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  <div className="text-2xl font-bold text-cybergray-900 dark:text-white">
                    {Object.keys(analyticsData.incidentsByThreatActor).length}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Main Charts */}
          <div className="space-y-8">
            {/* Monthly Trend */}
            <Card className="w-full overflow-hidden">
              <CardHeader className="pb-1">
                <CardTitle>Incident Trend Over Time</CardTitle>
                <CardDescription>
                  Monthly distribution of cyber incidents
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {loading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <Skeleton className="h-[250px] w-[90%]" />
                  </div>
                ) : (
                  <div className="h-[300px] w-full">
                    <LineChart data={monthlyTrendChartData} />
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Sector and Severity Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="overflow-hidden">
                <CardHeader className="pb-1">
                  <CardTitle>Incidents by Sector</CardTitle>
                  <CardDescription>
                    Distribution across different sectors
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Skeleton className="h-[250px] w-[90%]" />
                    </div>
                  ) : (
                    <div className="h-[300px] w-full">
                      <PieChart data={sectorChartData} />
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader className="pb-1">
                  <CardTitle>Incidents by Severity</CardTitle>
                  <CardDescription>
                    Distribution by impact level
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Skeleton className="h-[250px] w-[90%]" />
                    </div>
                  ) : (
                    <div className="h-[300px] w-full">
                      <PieChart data={severityChartData} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Attack Vectors and Threat Actors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="overflow-hidden">
                <CardHeader className="pb-1">
                  <CardTitle>Incidents by Attack Vector</CardTitle>
                  <CardDescription>
                    Most common attack techniques
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Skeleton className="h-[250px] w-[90%]" />
                    </div>
                  ) : (
                    <div className="h-[300px] w-full">
                      <BarChart data={attackVectorChartData} />
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader className="pb-1">
                  <CardTitle>Top Threat Actors</CardTitle>
                  <CardDescription>
                    Most active malicious groups
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Skeleton className="h-[250px] w-[90%]" />
                    </div>
                  ) : (
                    <div className="h-[300px] w-full">
                      <BarChart data={threatActorChartData} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Sector Vulnerability Matrix */}
            <Card className="w-full overflow-hidden">
              <CardHeader className="pb-1">
                <CardTitle>Sector Vulnerability Matrix</CardTitle>
                <CardDescription>
                  Attack vectors by sector
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {loading ? (
                  <div className="h-[350px] flex items-center justify-center">
                    <Skeleton className="h-[300px] w-[90%]" />
                  </div>
                ) : (
                  <div className="h-[350px] w-full">
                    <RadarChart data={sectorVulnerabilityChartData} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Key Insights */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>
                Strategic intelligence derived from the data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Most Targeted Sector */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Most Targeted Sector</h3>
                    {Object.keys(analyticsData.incidentsBySector).length > 0 ? (
                      <div className="bg-cybergray-100 dark:bg-cyberdark-700 p-5 rounded-lg h-full">
                        <div className="flex flex-col h-full">
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-xl font-bold text-cybergray-900 dark:text-white">
                              {Object.entries(analyticsData.incidentsBySector)
                                .sort((a, b) => b[1] - a[1])[0][0]}
                            </span>
                            <div className="text-3xl font-bold text-cyberblue-600 dark:text-cyberblue-400">
                              {Object.entries(analyticsData.incidentsBySector)
                                .sort((a, b) => b[1] - a[1])[0][1]}
                            </div>
                          </div>
                          <p className="text-cybergray-600 dark:text-cybergray-400">
                            This sector has experienced the highest number of cyber incidents, 
                            indicating it may be a primary target for threat actors or has 
                            significant security vulnerabilities.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-cybergray-600 dark:text-cybergray-400">
                        No sector data available for the selected time period.
                      </p>
                    )}
                  </div>
                  
                  {/* Dominant Attack Vector */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Dominant Attack Vector</h3>
                    {Object.keys(analyticsData.incidentsByAttackVector).length > 0 ? (
                      <div className="bg-cybergray-100 dark:bg-cyberdark-700 p-5 rounded-lg h-full">
                        <div className="flex flex-col h-full">
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-xl font-bold text-cybergray-900 dark:text-white">
                              {Object.entries(analyticsData.incidentsByAttackVector)
                                .sort((a, b) => b[1] - a[1])[0][0]}
                            </span>
                            <div className="text-3xl font-bold text-cyberblue-600 dark:text-cyberblue-400">
                              {Object.entries(analyticsData.incidentsByAttackVector)
                                .sort((a, b) => b[1] - a[1])[0][1]}
                            </div>
                          </div>
                          <p className="text-cybergray-600 dark:text-cybergray-400">
                            This attack vector is the most commonly used by threat actors. 
                            Organizations should prioritize defenses against this type of attack.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-cybergray-600 dark:text-cybergray-400">
                        No attack vector data available for the selected time period.
                      </p>
                    )}
                  </div>
                  
                  {/* Trend Analysis */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Trend Analysis</h3>
                    {Object.keys(analyticsData.incidentsByMonth).length > 1 ? (
                      <div className="bg-cybergray-100 dark:bg-cyberdark-700 p-5 rounded-lg h-full">
                        <p className="text-cybergray-600 dark:text-cybergray-400">
                          {getTrendAnalysis()}
                        </p>
                      </div>
                    ) : (
                      <p className="text-cybergray-600 dark:text-cybergray-400">
                        Insufficient time-series data available for trend analysis.
                      </p>
                    )}
                  </div>
                  
                  {/* Strategic Recommendations */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Strategic Recommendations</h3>
                    <div className="bg-cybergray-100 dark:bg-cyberdark-700 p-5 rounded-lg h-full">
                      <ul className="space-y-3 text-cybergray-600 dark:text-cybergray-400">
                        {getRecommendations().map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyberblue-500 mt-0.5 flex-shrink-0">
                              <path d="m5 13 4 4L19 7" />
                            </svg>
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
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

export default Analytics;