import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFirestore, addDoc, collection, Timestamp } from 'firebase/firestore';
import { app } from '../integrations/firebase/config';
import { toast } from '@/components/ui/use-toast';
import geminiService from '../services/GeminiService';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from './LoadingSpinner';
import { Globe, MessageCircle, Link2, AlertTriangle } from 'lucide-react';

// Type for cybercrime detection analysis
export interface CybercrimeAnalysis {
  id?: string;
  url: string;
  description?: string;
  sourceType: 'website' | 'social_media';
  platform?: string; // For social media links
  analysisResult?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  threatType?: string;
  createdAt: Timestamp;
  processedAt?: Timestamp;
  processed: boolean;
  userId?: string;
}

interface CybercrimeDetectionFormProps {
  onAnalysisComplete: () => void;
  onCancel: () => void;
}

const CybercrimeDetectionForm: React.FC<CybercrimeDetectionFormProps> = ({ 
  onAnalysisComplete, 
  onCancel 
}) => {
  const [urls, setUrls] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [sourceType, setSourceType] = useState<'website' | 'social_media'>('website');
  const [platform, setPlatform] = useState<string>('');

  // Function to analyze web links using Google Gemini AI model
  const analyzeWebLinks = async (urlsToAnalyze: string[], description: string) => {
    try {
      const db = getFirestore(app);
      setLoading(true);

      // Process each URL with the Gemini AI service
      for (const url of urlsToAnalyze) {
        // Create a record in the database first to track the analysis request
        const analysisData: Omit<CybercrimeAnalysis, 'id'> = {
          url: url.trim(),
          description,
          sourceType,
          platform: sourceType === 'social_media' ? platform : '',  // Use empty string instead of undefined
          createdAt: Timestamp.now(),
          processed: false
        };

        // Store the initial request in the database
        const docRef = await addDoc(collection(db, 'webLinkAnalysis'), analysisData);
        
        // Use Promise with timeout to handle asynchronous processing without blocking the UI
        // The analysis happens in the background and updates the database when complete
        (async () => {
          // Create a timeout promise that resolves after 30 seconds
          const timeoutPromise = new Promise<void>((_, reject) => {
            setTimeout(() => {
              reject(new Error('Analysis timed out after 30 seconds'));
            }, 30000); // 30 second timeout
          });
          
          try {
            // Race between the analysis and the timeout
            const geminiAnalysis = await Promise.race([
              geminiService.analyzeUrl(url, description, sourceType, platform),
              timeoutPromise
            ]) as any; // Using any here to handle the race result
            
            // Update the database with the analysis results
            const updateData = {
              analysisResult: geminiAnalysis.result,
              severity: geminiAnalysis.severity,
              threatType: geminiAnalysis.threatType,
              processedAt: Timestamp.now(),
              processed: true,
              modelUsed: 'Google Gemini',
              confidenceScore: geminiAnalysis.confidence,
              indicators: geminiAnalysis.indicators || [],
              recommendations: geminiAnalysis.recommendations || '',
              rawResponse: geminiAnalysis.rawResponse
            };
            
            // Store the analysis results
            await addDoc(collection(db, 'webLinkAnalysisResults'), {
              webLinkAnalysisId: docRef.id,
              ...updateData
            });
            
            console.log(`Analysis completed for URL: ${url}`);
          } catch (error) {
            console.error(`Error analyzing URL ${url}:`, error);
            
            // Even if analysis fails, update the document to mark it as processed with error
            try {
              await addDoc(collection(db, 'webLinkAnalysisResults'), {
                webLinkAnalysisId: docRef.id,
                analysisResult: `Error analyzing URL: ${error instanceof Error ? error.message : 'Unknown error'}`,
                severity: 'medium',  // Default severity when analysis fails
                threatType: 'Analysis Error',
                processedAt: Timestamp.now(),
                processed: true,
                modelUsed: 'Google Gemini',
                confidenceScore: 0,
                error: error instanceof Error ? error.message : 'Unknown error'
              });
            } catch (dbError) {
              console.error('Failed to record error in database:', dbError);
            }
          }
        })(); // Immediately invoke the async function
      }

      toast({
        title: 'Google Gemini Analysis Initiated',
        description: `${urlsToAnalyze.length} URLs have been submitted to Google Gemini AI for cybercrime detection. Results will appear on the dashboard once processed.`,
      });
      
      onAnalysisComplete();
    } catch (error) {
      console.error('Error analyzing web links:', error);
      toast({
        title: 'Analysis Error',
        description: `Failed to analyze web links: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // The actual Gemini AI analysis is now handled by the GeminiService

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Split by newline and filter empty lines
    const urlList = urls.split('\n')
      .map(url => url.trim())
      .filter(url => url !== '');
    
    if (urlList.length === 0) {
      toast({
        title: 'No URLs provided',
        description: 'Please enter at least one URL to analyze.',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate URLs
    const validUrlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;
    const invalidUrls = urlList.filter(url => !validUrlPattern.test(url));
    
    if (invalidUrls.length > 0) {
      toast({
        title: 'Invalid URLs detected',
        description: `Please ensure all URLs start with http:// or https:// and are properly formatted.`,
        variant: 'destructive',
      });
      return;
    }
    
    analyzeWebLinks(urlList, description);
  };

  return (
    <Card className="p-6 w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-4">Cybercrime Detection</h2>
          <p className="text-sm text-gray-500 mb-4">
            Analyze websites or social media links for potential cybercrime activities. 
            Google's Generative AI will analyze these links and identify potential threats.
          </p>
        </div>
        
        <Tabs defaultValue="website" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="website" 
              onClick={() => setSourceType('website')}
              className="flex items-center gap-2"
            >
              <Globe size={16} />
              Website Links
            </TabsTrigger>
            <TabsTrigger 
              value="social" 
              onClick={() => setSourceType('social_media')}
              className="flex items-center gap-2"
            >
              <MessageCircle size={16} />
              Social Media
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="website" className="mt-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="urls" className="block text-sm font-medium">
                Website URLs (one per line)
              </label>
              <Textarea
                id="urls"
                placeholder="https://example.com
https://another-site.com"
                rows={5}
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                disabled={loading}
                required
                className="w-full"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="social" className="mt-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="platform" className="block text-sm font-medium">
                Social Media Platform
              </label>
              <Select 
                value={platform} 
                onValueChange={setPlatform}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="reddit">Reddit</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="social-urls" className="block text-sm font-medium">
                Social Media Links (one per line)
              </label>
              <Textarea
                id="social-urls"
                placeholder="https://twitter.com/username/status/123456789
https://www.instagram.com/p/abcdef/"
                rows={5}
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                disabled={loading}
                required
                className="w-full"
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description (optional)
          </label>
          <Textarea
            id="description"
            placeholder="Any additional information about these links..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            className="w-full"
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-cyberblue-500 hover:bg-cyberblue-600 text-white"
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" className="mr-2" />
                Analyzing with Gemini...
              </>
            ) : (
              <>
                <AlertTriangle size={16} className="mr-2" />
                Detect Cybercrime using Google Gemini
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CybercrimeDetectionForm;
