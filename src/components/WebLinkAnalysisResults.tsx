import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, getDocs, orderBy, where, doc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CybercrimeAnalysis } from './WebLinkAnalysisForm';
import LoadingSpinner from './LoadingSpinner';
import { AlertCircle, Globe, Shield, ShieldAlert, ShieldCheck, List, CheckCircle, MessageCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

// Enhanced type for cybercrime detection with Gemini AI data
interface CybercrimeDetectionResult extends CybercrimeAnalysis {
  indicators?: string[];
  recommendations?: string;
  confidenceScore?: number;
  modelUsed?: string;
  rawResponse?: string;
  webLinkAnalysisId?: string; // Reference to the original analysis document
}

interface CybercrimeDetectionResultsProps {
  refreshTrigger?: number;
}

const CybercrimeDetectionResults: React.FC<CybercrimeDetectionResultsProps> = ({ refreshTrigger = 0 }) => {
  const [analyses, setAnalyses] = useState<CybercrimeDetectionResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    console.log('CybercrimeDetectionResults component mounted or refreshTrigger changed:', refreshTrigger);
    fetchAnalysisResults();
  }, [refreshTrigger]);

  const fetchAnalysisResults = async () => {
    try {
      setLoading(true);
      const db = getFirestore();
      
      console.log('Fetching cybercrime detection results...');
      
      // Directly query the results collection instead of the requests
      // This is a more efficient approach as we only need one query
      const resultsRef = collection(db, 'webLinkAnalysisResults');
      const q = query(resultsRef, orderBy('processedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      console.log(`Found ${querySnapshot.docs.length} analysis results`);
      
      // Array to hold all analyses with their results
      const analysesWithResults: CybercrimeDetectionResult[] = [];
      
      for (const docSnapshot of querySnapshot.docs) {
        const resultData = docSnapshot.data();
        console.log('Processing result data:', resultData);
        
        // Now we need to get the original analysis data to get the URL and description
        try {
          // Get the original analysis document using the webLinkAnalysisId
          const analysisRef = doc(db, 'webLinkAnalysis', resultData.webLinkAnalysisId);
          const analysisSnapshot = await getDoc(analysisRef);
          
          if (analysisSnapshot.exists()) {
            const analysisData = analysisSnapshot.data();
            console.log('Found original analysis data:', analysisData);
            
            // Create a complete result object combining both documents
            const completeResult: CybercrimeDetectionResult = {
              id: docSnapshot.id,
              url: analysisData.url,
              description: analysisData.description || '',
              sourceType: analysisData.sourceType || 'website',
              platform: analysisData.platform || '',
              createdAt: analysisData.createdAt,
              processedAt: resultData.processedAt,
              processed: true,
              analysisResult: resultData.analysisResult,
              severity: resultData.severity,
              threatType: resultData.threatType,
              indicators: resultData.indicators || [],
              recommendations: resultData.recommendations || '',
              confidenceScore: resultData.confidenceScore || 0,
              modelUsed: resultData.modelUsed || 'Google Gemini',
              rawResponse: resultData.rawResponse,
              webLinkAnalysisId: resultData.webLinkAnalysisId
            };
            
            analysesWithResults.push(completeResult);
          } else {
            console.log(`Original analysis not found for ID: ${resultData.webLinkAnalysisId}`);
          }
        } catch (error) {
          console.error('Error fetching original analysis:', error);
        }
      }
      
      console.log('Final analyses to display:', analysesWithResults);
      setAnalyses(analysesWithResults);
    } catch (error) {
      console.error('Error fetching analysis results:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete an analysis result
  const deleteAnalysis = async (analysisId: string, webLinkAnalysisId?: string) => {
    try {
      setDeleting(analysisId);
      const db = getFirestore();
      
      console.log('Deleting analysis result:', analysisId);
      console.log('Original analysis ID:', webLinkAnalysisId);
      
      // Delete the result document
      await deleteDoc(doc(db, 'webLinkAnalysisResults', analysisId));
      
      // Also delete the original analysis document if we have a valid ID
      if (webLinkAnalysisId && webLinkAnalysisId.trim() !== '') {
        await deleteDoc(doc(db, 'webLinkAnalysis', webLinkAnalysisId));
      }
      
      // Update the UI by removing the deleted analysis
      setAnalyses(prevAnalyses => prevAnalyses.filter(a => a.id !== analysisId));
      
      toast({
        title: 'Analysis deleted',
        description: 'The cybercrime detection result has been deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting analysis:', error);
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting the analysis. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(null);
    }
  };

  const getSeverityColor = (severity?: 'low' | 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-black';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getThreatIcon = (severity?: 'low' | 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'critical':
        return <ShieldAlert className="h-5 w-5 mr-1 text-red-500" />;
      case 'high':
        return <AlertCircle className="h-5 w-5 mr-1 text-orange-500" />;
      case 'medium':
        return <Shield className="h-5 w-5 mr-1 text-yellow-500" />;
      case 'low':
        return <ShieldCheck className="h-5 w-5 mr-1 text-green-500" />;
      default:
        return <Globe className="h-5 w-5 mr-1 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Recent Cybercrime Detection Results</h3>
      
      {analyses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No cybercrime detection results found. Start by analyzing websites or social media links.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="overflow-hidden">
              <CardHeader className="bg-cybergray-50 dark:bg-cybergray-800 py-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-medium truncate">
                    <a
                      href={analysis.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyberblue-500 hover:underline flex items-center"
                    >
                      {analysis.sourceType === 'social_media' ? (
                        <MessageCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <Globe className="h-4 w-4 mr-1" />
                      )}
                      {analysis.url}
                      {analysis.sourceType === 'social_media' && analysis.platform && (
                        <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                          {analysis.platform}
                        </span>
                      )}
                    </a>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 -mt-1 h-8 w-8 p-0"
                    onClick={() => deleteAnalysis(analysis.id, analysis.webLinkAnalysisId || '')}
                    disabled={deleting === analysis.id}
                    title="Delete this analysis"
                  >
                    {deleting === analysis.id ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                {!analysis.analysisResult ? (
                  <div className="flex items-center justify-center py-4 text-sm text-gray-500">
                    <LoadingSpinner size="small" className="mr-2" />
                    Analysis in progress with Google Gemini...
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        {getThreatIcon(analysis.severity)}
                        <span className="font-medium">
                          {analysis.threatType || 'Unknown Threat'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {analysis.confidenceScore && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                            {Math.round((analysis.confidenceScore) * 100)}% confidence
                          </span>
                        )}
                        <Badge className={getSeverityColor(analysis.severity)}>
                          {analysis.severity || 'Unknown'}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {analysis.analysisResult || 'No analysis result available.'}
                    </p>
                    
                    {/* Indicators Section */}
                    {analysis.indicators && analysis.indicators.length > 0 && (
                      <div className="mt-3 mb-3">
                        <div className="flex items-center text-sm font-medium mb-1 text-red-600 dark:text-red-400">
                          <List className="h-4 w-4 mr-1" />
                          Suspicious Indicators:
                        </div>
                        <ul className="text-xs text-gray-700 dark:text-gray-300 pl-5 list-disc">
                          {analysis.indicators.slice(0, 3).map((indicator, index) => (
                            <li key={index}>{indicator}</li>
                          ))}
                          {analysis.indicators.length > 3 && (
                            <li className="text-gray-500">+{analysis.indicators.length - 3} more indicators</li>
                          )}
                        </ul>
                      </div>
                    )}
                    
                    {/* Recommendations Section */}
                    {analysis.recommendations && (
                      <div className="mt-3 mb-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                        <div className="flex items-center text-sm font-medium mb-1 text-blue-600 dark:text-blue-400">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Recommendations:
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          {analysis.recommendations}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                      <span>Analyzed by: {analysis.modelUsed || 'Google Gemini'}</span>
                      <span>{analysis.processedAt?.toDate().toLocaleString()}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CybercrimeDetectionResults;
