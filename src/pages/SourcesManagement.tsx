import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { dataCollectionService } from '../services/DataCollectionService';

interface SourceConfig {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'website' | 'twitter' | 'reddit' | 'github' | 'pastebin';
  selectors?: {
    container?: string;
    title?: string;
    content?: string;
    date?: string;
  };
  keywords: string[];
  enabled: boolean;
  lastScraped?: Timestamp;
}

const SourcesManagement = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sources, setSources] = useState<SourceConfig[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRunningCollection, setIsRunningCollection] = useState(false);
  const [collectionResult, setCollectionResult] = useState<{ total: number; new: number; errors: number } | null>(null);
  
  // Form state for adding/editing sources
  const [currentSource, setCurrentSource] = useState<Partial<SourceConfig>>({
    name: '',
    url: '',
    type: 'website',
    keywords: [],
    enabled: true,
    selectors: {
      container: '',
      title: '',
      content: '',
      date: ''
    }
  });
  const [keywordsInput, setKeywordsInput] = useState('');
  
  useEffect(() => {
    // Redirect if not admin
    if (!loading && !isAdmin) {
      toast.error('You do not have permission to access this page');
      navigate('/dashboard');
    }
  }, [isAdmin, loading, navigate]);
  
  useEffect(() => {
    const fetchSources = async () => {
      try {
        const db = getFirestore();
        const sourcesRef = collection(db, 'dataSources');
        const sourcesSnapshot = await getDocs(sourcesRef);
        
        const fetchedSources: SourceConfig[] = [];
        sourcesSnapshot.forEach(doc => {
          fetchedSources.push({ id: doc.id, ...doc.data() } as SourceConfig);
        });
        
        setSources(fetchedSources);
      } catch (error) {
        console.error('Error fetching sources:', error);
        toast.error('Failed to load data sources');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSources();
  }, []);
  
  const handleAddSource = async () => {
    try {
      // Validate form
      if (!currentSource.name || !currentSource.url || !keywordsInput) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      const keywords = keywordsInput.split(',').map(k => k.trim()).filter(k => k);
      
      if (keywords.length === 0) {
        toast.error('Please add at least one keyword');
        return;
      }
      
      const db = getFirestore();
      const sourcesRef = collection(db, 'dataSources');
      
      await addDoc(sourcesRef, {
        name: currentSource.name,
        url: currentSource.url,
        type: currentSource.type,
        selectors: currentSource.selectors,
        keywords,
        enabled: currentSource.enabled,
        createdAt: Timestamp.now(),
        lastScraped: null
      });
      
      // Reset form and close dialog
      setCurrentSource({
        name: '',
        url: '',
        type: 'website',
        keywords: [],
        enabled: true,
        selectors: {
          container: '',
          title: '',
          content: '',
          date: ''
        }
      });
      setKeywordsInput('');
      setIsAddDialogOpen(false);
      
      // Refresh sources
      const sourcesSnapshot = await getDocs(sourcesRef);
      const updatedSources: SourceConfig[] = [];
      sourcesSnapshot.forEach(doc => {
        updatedSources.push({ id: doc.id, ...doc.data() } as SourceConfig);
      });
      
      setSources(updatedSources);
      toast.success('Data source added successfully');
    } catch (error) {
      console.error('Error adding source:', error);
      toast.error('Failed to add data source');
    }
  };
  
  const handleEditSource = async () => {
    try {
      if (!currentSource.id) {
        toast.error('Source ID is missing');
        return;
      }
      
      // Validate form
      if (!currentSource.name || !currentSource.url || !keywordsInput) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      const keywords = keywordsInput.split(',').map(k => k.trim()).filter(k => k);
      
      if (keywords.length === 0) {
        toast.error('Please add at least one keyword');
        return;
      }
      
      const db = getFirestore();
      const sourceRef = doc(db, 'dataSources', currentSource.id);
      
      await updateDoc(sourceRef, {
        name: currentSource.name,
        url: currentSource.url,
        type: currentSource.type,
        selectors: currentSource.selectors,
        keywords,
        enabled: currentSource.enabled,
        updatedAt: Timestamp.now()
      });
      
      // Reset form and close dialog
      setCurrentSource({
        name: '',
        url: '',
        type: 'website',
        keywords: [],
        enabled: true,
        selectors: {
          container: '',
          title: '',
          content: '',
          date: ''
        }
      });
      setKeywordsInput('');
      setIsEditDialogOpen(false);
      
      // Refresh sources
      const sourcesRef = collection(db, 'dataSources');
      const sourcesSnapshot = await getDocs(sourcesRef);
      const updatedSources: SourceConfig[] = [];
      sourcesSnapshot.forEach(doc => {
        updatedSources.push({ id: doc.id, ...doc.data() } as SourceConfig);
      });
      
      setSources(updatedSources);
      toast.success('Data source updated successfully');
    } catch (error) {
      console.error('Error updating source:', error);
      toast.error('Failed to update data source');
    }
  };
  
  const handleDeleteSource = async (id: string) => {
    try {
      if (!confirm('Are you sure you want to delete this data source?')) {
        return;
      }
      
      const db = getFirestore();
      const sourceRef = doc(db, 'dataSources', id);
      
      await deleteDoc(sourceRef);
      
      // Refresh sources
      const updatedSources = sources.filter(source => source.id !== id);
      setSources(updatedSources);
      
      toast.success('Data source deleted successfully');
    } catch (error) {
      console.error('Error deleting source:', error);
      toast.error('Failed to delete data source');
    }
  };
  
  const handleToggleSource = async (id: string, enabled: boolean) => {
    try {
      const db = getFirestore();
      const sourceRef = doc(db, 'dataSources', id);
      
      await updateDoc(sourceRef, {
        enabled: !enabled,
        updatedAt: Timestamp.now()
      });
      
      // Update local state
      const updatedSources = sources.map(source => 
        source.id === id ? { ...source, enabled: !enabled } : source
      );
      
      setSources(updatedSources);
      
      toast.success(`Data source ${!enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error toggling source:', error);
      toast.error('Failed to update data source');
    }
  };
  
  const handleEditClick = (source: SourceConfig) => {
    setCurrentSource(source);
    setKeywordsInput(source.keywords.join(', '));
    setIsEditDialogOpen(true);
  };
  
  const runDataCollection = async () => {
    try {
      setIsRunningCollection(true);
      setCollectionResult(null);
      
      // Run the data collection process
      const result = await dataCollectionService.runCollection();
      
      setCollectionResult(result);
      toast.success(`Data collection completed: ${result.new} new incidents collected`);
    } catch (error) {
      console.error('Error running data collection:', error);
      toast.error('Failed to run data collection');
    } finally {
      setIsRunningCollection(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-cybergray-50 dark:bg-cyberdark">
        <Navbar />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
            </div>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-4 w-96" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <Skeleton className="h-6 w-48 mb-2" />
                          <Skeleton className="h-4 w-64" />
                        </div>
                        <Skeleton className="h-8 w-24" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cybergray-50 dark:bg-cyberdark">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-cybergray-900 dark:text-white mb-2">
                Data Sources Management
              </h1>
              <p className="text-cybergray-600 dark:text-cybergray-400">
                Configure and manage data collection sources
              </p>
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={runDataCollection} 
                disabled={isRunningCollection}
                className="bg-cyberblue-500 hover:bg-cyberblue-600"
              >
                {isRunningCollection ? 'Running...' : 'Run Collection'}
              </Button>
              
              <Button onClick={() => setIsAddDialogOpen(true)}>
                Add Source
              </Button>
            </div>
          </div>
          
          {/* Collection Result */}
          {collectionResult && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Collection Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-cyberdark-700 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="text-sm text-cybergray-500 dark:text-cybergray-400 mb-1">
                      Total Incidents Processed
                    </div>
                    <div className="text-2xl font-bold text-cybergray-900 dark:text-white">
                      {collectionResult.total}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-cyberdark-700 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="text-sm text-cybergray-500 dark:text-cybergray-400 mb-1">
                      New Incidents Added
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {collectionResult.new}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-cyberdark-700 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="text-sm text-cybergray-500 dark:text-cybergray-400 mb-1">
                      Errors
                    </div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {collectionResult.errors}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Sources List */}
          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>
                Configure where the system collects cyber incident data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sources.length > 0 ? (
                <div className="space-y-4">
                  {sources.map(source => (
                    <div 
                      key={source.id} 
                      className="border border-gray-200 dark:border-gray-800 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-cybergray-900 dark:text-white">
                              {source.name}
                            </h3>
                            <Badge variant={source.enabled ? 'default' : 'secondary'}>
                              {source.enabled ? 'Active' : 'Disabled'}
                            </Badge>
                            <Badge variant="outline">
                              {source.type.charAt(0).toUpperCase() + source.type.slice(1)}
                            </Badge>
                          </div>
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-cyberblue-600 dark:text-cyberblue-400 hover:underline"
                          >
                            {source.url}
                          </a>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={source.enabled} 
                            onCheckedChange={() => handleToggleSource(source.id, source.enabled)}
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditClick(source)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteSource(source.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm font-medium text-cybergray-700 dark:text-cybergray-300 mb-1">
                          Keywords:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {source.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {source.lastScraped && (
                        <div className="text-xs text-cybergray-500 dark:text-cybergray-400">
                          Last scraped: {source.lastScraped.toDate().toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-cybergray-500 dark:text-cybergray-400">
                  No data sources configured. Add your first source to start collecting data.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Add Source Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Data Source</DialogTitle>
            <DialogDescription>
              Configure a new source for collecting cyber incident data
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Source Name</Label>
                <Input 
                  id="name" 
                  value={currentSource.name} 
                  onChange={(e) => setCurrentSource({...currentSource, name: e.target.value})}
                  placeholder="e.g., CERT-In Advisories"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Source Type</Label>
                <Select 
                  value={currentSource.type} 
                  onValueChange={(value: 'rss' | 'website' | 'twitter' | 'reddit' | 'github' | 'pastebin') => 
                    setCurrentSource({...currentSource, type: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="rss">RSS Feed</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="reddit">Reddit</SelectItem>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="pastebin">Pastebin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input 
                id="url" 
                value={currentSource.url} 
                onChange={(e) => setCurrentSource({...currentSource, url: e.target.value})}
                placeholder="https://example.com/feed"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma separated)</Label>
              <Textarea 
                id="keywords" 
                value={keywordsInput} 
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="cyber attack, data breach, vulnerability, India, Indian"
                rows={3}
              />
              <p className="text-xs text-cybergray-500 dark:text-cybergray-400">
                Add keywords to filter content from this source
              </p>
            </div>
            
            <Tabs defaultValue="selectors" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="selectors">Selectors</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
              </TabsList>
              
              <TabsContent value="selectors" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="container">Container Selector</Label>
                  <Input 
                    id="container" 
                    value={currentSource.selectors?.container || ''} 
                    onChange={(e) => setCurrentSource({
                      ...currentSource, 
                      selectors: {...currentSource.selectors, container: e.target.value}
                    })}
                    placeholder=".article, #content, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Title Selector</Label>
                  <Input 
                    id="title" 
                    value={currentSource.selectors?.title || ''} 
                    onChange={(e) => setCurrentSource({
                      ...currentSource, 
                      selectors: {...currentSource.selectors, title: e.target.value}
                    })}
                    placeholder="h1, .title, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content Selector</Label>
                  <Input 
                    id="content" 
                    value={currentSource.selectors?.content || ''} 
                    onChange={(e) => setCurrentSource({
                      ...currentSource, 
                      selectors: {...currentSource.selectors, content: e.target.value}
                    })}
                    placeholder=".content, article p, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date Selector</Label>
                  <Input 
                    id="date" 
                    value={currentSource.selectors?.date || ''} 
                    onChange={(e) => setCurrentSource({
                      ...currentSource, 
                      selectors: {...currentSource.selectors, date: e.target.value}
                    })}
                    placeholder=".date, time, etc."
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="options">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enabled" 
                      checked={currentSource.enabled} 
                      onCheckedChange={(checked) => setCurrentSource({...currentSource, enabled: checked})}
                    />
                    <Label htmlFor="enabled">Enable this source</Label>
                  </div>
                  
                  <p className="text-sm text-cybergray-600 dark:text-cybergray-400">
                    When enabled, this source will be included in data collection runs.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSource}>
              Add Source
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Source Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Data Source</DialogTitle>
            <DialogDescription>
              Update configuration for this data source
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Source Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentSource.name} 
                  onChange={(e) => setCurrentSource({...currentSource, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-type">Source Type</Label>
                <Select 
                  value={currentSource.type} 
                  onValueChange={(value: 'rss' | 'website' | 'twitter' | 'reddit' | 'github' | 'pastebin') => 
                    setCurrentSource({...currentSource, type: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="rss">RSS Feed</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="reddit">Reddit</SelectItem>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="pastebin">Pastebin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-url">URL</Label>
              <Input 
                id="edit-url" 
                value={currentSource.url} 
                onChange={(e) => setCurrentSource({...currentSource, url: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-keywords">Keywords (comma separated)</Label>
              <Textarea 
                id="edit-keywords" 
                value={keywordsInput} 
                onChange={(e) => setKeywordsInput(e.target.value)}
                rows={3}
              />
            </div>
            
            <Tabs defaultValue="selectors" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="selectors">Selectors</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
              </TabsList>
              
              <TabsContent value="selectors" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-container">Container Selector</Label>
                  <Input 
                    id="edit-container" 
                    value={currentSource.selectors?.container || ''} 
                    onChange={(e) => setCurrentSource({
                      ...currentSource, 
                      selectors: {...currentSource.selectors, container: e.target.value}
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title Selector</Label>
                  <Input 
                    id="edit-title" 
                    value={currentSource.selectors?.title || ''} 
                    onChange={(e) => setCurrentSource({
                      ...currentSource, 
                      selectors: {...currentSource.selectors, title: e.target.value}
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-content">Content Selector</Label>
                  <Input 
                    id="edit-content" 
                    value={currentSource.selectors?.content || ''} 
                    onChange={(e) => setCurrentSource({
                      ...currentSource, 
                      selectors: {...currentSource.selectors, content: e.target.value}
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date Selector</Label>
                  <Input 
                    id="edit-date" 
                    value={currentSource.selectors?.date || ''} 
                    onChange={(e) => setCurrentSource({
                      ...currentSource, 
                      selectors: {...currentSource.selectors, date: e.target.value}
                    })}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="options">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="edit-enabled" 
                      checked={currentSource.enabled} 
                      onCheckedChange={(checked) => setCurrentSource({...currentSource, enabled: checked})}
                    />
                    <Label htmlFor="edit-enabled">Enable this source</Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSource}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default SourcesManagement;