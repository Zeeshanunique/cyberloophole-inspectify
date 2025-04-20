import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { getFirestore, collection, query, getDocs, orderBy, where, Timestamp, doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { app } from '../integrations/firebase/config';
import { PlusCircle, RefreshCw } from 'lucide-react';

// Initialize Firestore with the app instance
const db = getFirestore(app);

// Types for our data
interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  sector: string;
  source: string;
  sourceUrl?: string;
  date: Timestamp;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  affectedSystems?: string[];
  attackVector?: string;
  threatActors?: {
    name: string;
    confidence: number;
    attributes?: {
      motivation?: string;
      sophistication?: string;
      country?: string;
    };
  }[];
  indicators?: string[];
  similarIncidents?: {
    id: string;
    title: string;
    similarity: number;
  }[];
}

const Incidents = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sectors, setSectors] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const incidentsRef = collection(db, 'incidents');
        const incidentsQuery = query(incidentsRef, orderBy('date', 'desc'));
        const incidentsSnapshot = await getDocs(incidentsQuery);
        
        const fetchedIncidents: Incident[] = [];
        const uniqueSectors = new Set<string>();
        
        incidentsSnapshot.forEach(doc => {
          const data = doc.data() as Omit<Incident, 'id'>;
          const incident = { id: doc.id, ...data } as Incident;
          fetchedIncidents.push(incident);
          
          if (data.sector) {
            uniqueSectors.add(data.sector);
          }
        });
        
        setIncidents(fetchedIncidents);
        setFilteredIncidents(fetchedIncidents);
        setSectors(Array.from(uniqueSectors).sort());
      } catch (error) {
        console.error('Error fetching incidents:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIncidents();
  }, [refreshKey]);
  
  useEffect(() => {
    // Apply filters
    let filtered = incidents;
    
    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(incident => 
        incident.title.toLowerCase().includes(term) || 
        incident.description.toLowerCase().includes(term) ||
        (incident.attackVector && incident.attackVector.toLowerCase().includes(term))
      );
    }
    
    // Sector filter
    if (sectorFilter !== 'all') {
      filtered = filtered.filter(incident => incident.sector === sectorFilter);
    }
    
    // Severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(incident => incident.severity === severityFilter);
    }
    
    setFilteredIncidents(filtered);
  }, [searchTerm, sectorFilter, severityFilter, incidents]);
  
  const handleIncidentClick = async (incident: Incident) => {
    setSelectedIncident(incident);
    setIsDialogOpen(true);
    
    // If we have similar incidents, fetch their details
    if (incident.similarIncidents && incident.similarIncidents.length > 0) {
      try {
        const updatedSimilarIncidents = await Promise.all(
          incident.similarIncidents.map(async (similar) => {
            const docRef = doc(db, 'incidents', similar.id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              return {
                ...similar,
                data: docSnap.data()
              };
            }
            
            return similar;
          })
        );
        
        setSelectedIncident({
          ...incident,
          similarIncidents: updatedSimilarIncidents
        });
      } catch (error) {
        console.error('Error fetching similar incidents:', error);
      }
    }
  };

  // Function to navigate to add incident form
  const navigateToAddIncident = () => {
    navigate('/incidents/add');
  };

  // Function to refresh data
  const refreshData = () => {
    setRefreshKey(prevKey => prevKey + 1);
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
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'investigating': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'false_positive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cybergray-50 dark:bg-cyberdark">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-cybergray-900 dark:text-white mb-2">
                Cyber Incidents
              </h1>
              <p className="text-cybergray-600 dark:text-cybergray-400">
                Browse and analyze cyber incidents affecting Indian infrastructure
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={refreshData}
                className="flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh
              </Button>
              <Button 
                onClick={navigateToAddIncident}
                className="bg-cyberblue-500 hover:bg-cyberblue-600 text-white flex items-center gap-2"
              >
                <PlusCircle size={16} />
                Add Incident
              </Button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Input
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-4">
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats Summary */}
          {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white dark:bg-cyberdark-700">
                <CardContent className="p-4">
                  <div className="text-sm text-cybergray-500 dark:text-cybergray-400">Total Incidents</div>
                  <div className="text-2xl font-bold text-cybergray-900 dark:text-white">{filteredIncidents.length}</div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-cyberdark-700">
                <CardContent className="p-4">
                  <div className="text-sm text-cybergray-500 dark:text-cybergray-400">Critical</div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {filteredIncidents.filter(i => i.severity === 'critical').length}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-cyberdark-700">
                <CardContent className="p-4">
                  <div className="text-sm text-cybergray-500 dark:text-cybergray-400">High Severity</div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {filteredIncidents.filter(i => i.severity === 'high').length}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-cyberdark-700">
                <CardContent className="p-4">
                  <div className="text-sm text-cybergray-500 dark:text-cybergray-400">Open Incidents</div>
                  <div className="text-2xl font-bold text-cyberblue-600 dark:text-cyberblue-400">
                    {filteredIncidents.filter(i => i.status === 'new' || i.status === 'investigating').length}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Incidents List */}
          <div className="space-y-4">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-64" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))
            ) : filteredIncidents.length > 0 ? (
              filteredIncidents.map(incident => (
                <Card 
                  key={incident.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleIncidentClick(incident)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-cybergray-900 dark:text-white">
                        {incident.title}
                      </h3>
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-cybergray-500 dark:text-cybergray-400 mb-3">
                      <span>
                        {incident.date.toDate().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span>•</span>
                      <span>{incident.sector}</span>
                      {incident.attackVector && (
                        <>
                          <span>•</span>
                          <span>{incident.attackVector}</span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-cybergray-600 dark:text-cybergray-400 mb-4 line-clamp-2">
                      {incident.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Source: {incident.source}
                        </Badge>
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status.replace('_', ' ').charAt(0).toUpperCase() + incident.status.replace('_', ' ').slice(1)}
                        </Badge>
                      </div>
                      
                      {incident.threatActors && incident.threatActors.length > 0 && (
                        <div className="text-sm text-cybergray-600 dark:text-cybergray-400">
                          Attributed to: {incident.threatActors[0].name}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="mb-4 text-cybergray-400 dark:text-cybergray-500">No incidents found matching your filters</div>
                <Button onClick={navigateToAddIncident} className="bg-cyberblue-500 hover:bg-cyberblue-600 text-white">
                  Add Your First Incident
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Incident Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedIncident && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start gap-4">
                  <DialogTitle className="text-2xl">{selectedIncident.title}</DialogTitle>
                  <Badge className={getSeverityColor(selectedIncident.severity)}>
                    {selectedIncident.severity.charAt(0).toUpperCase() + selectedIncident.severity.slice(1)}
                  </Badge>
                </div>
                <DialogDescription>
                  <div className="flex items-center gap-2 text-sm">
                    <span>
                      {selectedIncident.date.toDate().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span>•</span>
                    <span>{selectedIncident.sector}</span>
                    {selectedIncident.attackVector && (
                      <>
                        <span>•</span>
                        <span>{selectedIncident.attackVector}</span>
                      </>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="attribution">Attribution</TabsTrigger>
                  <TabsTrigger value="indicators">Indicators</TabsTrigger>
                  <TabsTrigger value="related">Related Incidents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Description</h4>
                    <p className="text-cybergray-600 dark:text-cybergray-400 whitespace-pre-line">
                      {selectedIncident.description}
                    </p>
                  </div>
                  
                  {selectedIncident.affectedSystems && selectedIncident.affectedSystems.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Affected Systems</h4>
                      <ul className="list-disc pl-5 space-y-1 text-cybergray-600 dark:text-cybergray-400">
                        {selectedIncident.affectedSystems.map((system, index) => (
                          <li key={index}>{system}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Status</h4>
                      <Badge className={getStatusColor(selectedIncident.status)}>
                        {selectedIncident.status.replace('_', ' ').charAt(0).toUpperCase() + selectedIncident.status.replace('_', ' ').slice(1)}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Source</h4>
                      {selectedIncident.sourceUrl ? (
                        <a 
                          href={selectedIncident.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cyberblue-600 dark:text-cyberblue-400 hover:underline"
                        >
                          {selectedIncident.source}
                        </a>
                      ) : (
                        <span className="text-cybergray-600 dark:text-cybergray-400">
                          {selectedIncident.source}
                        </span>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="attribution">
                  {selectedIncident.threatActors && selectedIncident.threatActors.length > 0 ? (
                    <div className="space-y-6">
                      {selectedIncident.threatActors.map((actor, index) => (
                        <div key={index} className="bg-white dark:bg-cyberdark-700 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-lg font-semibold">{actor.name}</h4>
                            <Badge variant="outline">
                              Confidence: {Math.round(actor.confidence * 100)}%
                            </Badge>
                          </div>
                          
                          {actor.attributes && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              {actor.attributes.motivation && (
                                <div>
                                  <span className="font-medium text-cybergray-500 dark:text-cybergray-400">Motivation:</span>{' '}
                                  <span className="text-cybergray-900 dark:text-white">{actor.attributes.motivation}</span>
                                </div>
                              )}
                              
                              {actor.attributes.sophistication && (
                                <div>
                                  <span className="font-medium text-cybergray-500 dark:text-cybergray-400">Sophistication:</span>{' '}
                                  <span className="text-cybergray-900 dark:text-white">{actor.attributes.sophistication}</span>
                                </div>
                              )}
                              
                              {actor.attributes.country && (
                                <div>
                                  <span className="font-medium text-cybergray-500 dark:text-cybergray-400">Country:</span>{' '}
                                  <span className="text-cybergray-900 dark:text-white">{actor.attributes.country}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-cybergray-500 dark:text-cybergray-400">
                      No attribution information available for this incident.
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="indicators">
                  {selectedIncident.indicators && selectedIncident.indicators.length > 0 ? (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Indicators of Compromise</h4>
                      <div className="bg-cybergray-100 dark:bg-cyberdark-800 p-4 rounded-lg overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-cybergray-200 dark:border-cyberdark-700">
                              <th className="text-left py-2 px-4">Indicator</th>
                              <th className="text-left py-2 px-4">Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedIncident.indicators.map((indicator, index) => {
                              // Simple type detection
                              let type = 'Unknown';
                              if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(indicator)) {
                                type = 'IP Address';
                              } else if (/^[a-f0-9]{32}$/i.test(indicator)) {
                                type = 'MD5 Hash';
                              } else if (/^[a-f0-9]{40}$/i.test(indicator)) {
                                type = 'SHA1 Hash';
                              } else if (/^[a-f0-9]{64}$/i.test(indicator)) {
                                type = 'SHA256 Hash';
                              } else if (/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i.test(indicator)) {
                                type = 'Domain';
                              }
                              
                              return (
                                <tr key={index} className="border-b border-cybergray-200 dark:border-cyberdark-700">
                                  <td className="py-2 px-4 font-mono">{indicator}</td>
                                  <td className="py-2 px-4">{type}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-cybergray-500 dark:text-cybergray-400">
                      No indicators of compromise available for this incident.
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="related">
                  {selectedIncident.similarIncidents && selectedIncident.similarIncidents.length > 0 ? (
                    <div className="space-y-4">
                      {selectedIncident.similarIncidents.map((similar, index) => (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{similar.title}</h4>
                              <Badge variant="outline">
                                Similarity: {Math.round(similar.similarity * 100)}%
                              </Badge>
                            </div>
                            <div className="mt-2 text-sm text-cybergray-600 dark:text-cybergray-400">
                              <div className="mt-2 flex items-center gap-2">
                                <button
                                  onClick={() => handleIncidentClick({id: similar.id} as Incident)}
                                  className="text-cyberblue-500 hover:text-cyberblue-600 dark:hover:text-cyberblue-400 font-medium"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-cybergray-500 dark:text-cybergray-400">
                      No related incidents found.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Incidents;