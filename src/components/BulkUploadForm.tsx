import React, { useState, useRef } from 'react';
import { app } from '../integrations/firebase/config';
import { getFirestore, collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, AlertCircle, FileText, Upload } from 'lucide-react';
import Papa from 'papaparse';

// Initialize Firestore
const db = getFirestore(app);

// Interface for parsed incident data
interface IncidentData {
  title: string;
  description: string;
  severity: string;
  sector?: string;
  source?: string;
  sourceUrl?: string;
  attackVector?: string;
  status?: string;
  indicatorsOfCompromise?: string;
  affectedSystems?: string;
  [key: string]: any; // For dynamic field access
}

const BulkUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [processedRows, setProcessedRows] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState<IncidentData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setErrors([]);
      
      // Preview the CSV
      parseCSV(selectedFile, 5); // Preview first 5 rows
    }
  };

  const parseCSV = (file: File, previewLimit?: number) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as IncidentData[];
        
        // Validate required fields
        const validationErrors: string[] = [];
        data.forEach((row, index) => {
          if (!row.title) {
            validationErrors.push(`Row ${index + 1}: Missing title`);
          }
          if (!row.description) {
            validationErrors.push(`Row ${index + 1}: Missing description`);
          }
          if (!row.severity || !['low', 'medium', 'high', 'critical'].includes(row.severity.toLowerCase())) {
            validationErrors.push(`Row ${index + 1}: Invalid severity (must be 'low', 'medium', 'high', or 'critical')`);
          }
        });
        
        setErrors(validationErrors);
        setTotalRows(data.length);
        
        // Set preview data
        if (previewLimit && data.length > 0) {
          setPreview(data.slice(0, previewLimit));
        }
      }
    });
  };
  
  const cleanAndProcessData = (data: IncidentData) => {
    // Convert comma-separated strings to arrays
    const processedData = { ...data };
    
    // Convert indicatorsOfCompromise to array if it's a string
    if (typeof processedData.indicatorsOfCompromise === 'string' && processedData.indicatorsOfCompromise.trim() !== '') {
      processedData.indicatorsOfCompromise = processedData.indicatorsOfCompromise.split(',').map(item => item.trim());
    } else {
      processedData.indicatorsOfCompromise = [];
    }
    
    // Convert affectedSystems to array if it's a string
    if (typeof processedData.affectedSystems === 'string' && processedData.affectedSystems.trim() !== '') {
      processedData.affectedSystems = processedData.affectedSystems.split(',').map(item => item.trim());
    } else {
      processedData.affectedSystems = [];
    }
    
    // Add timestamp
    processedData.timestamp = new Date();
    
    // Ensure severity is lowercase
    if (processedData.severity) {
      processedData.severity = processedData.severity.toLowerCase();
    }
    
    return processedData;
  };

  const handleUpload = () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    setProcessedRows(0);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data as IncidentData[];
        
        // If there are validation errors, don't proceed
        if (errors.length > 0) {
          setUploading(false);
          toast({
            title: "Validation errors",
            description: "Please fix the errors in your CSV file before uploading.",
            variant: "destructive",
          });
          return;
        }
        
        try {
          // Use batched writes for better performance
          const incidentsRef = collection(db, "incidents");
          let processedCount = 0;
          
          // Process in batches of 500 (Firestore batch limit)
          const batchSize = 500;
          for (let i = 0; i < data.length; i += batchSize) {
            const batch = writeBatch(db);
            const batchData = data.slice(i, i + batchSize);
            
            batchData.forEach(incident => {
              const docRef = doc(incidentsRef);
              const processedIncident = cleanAndProcessData(incident);
              batch.set(docRef, processedIncident);
            });
            
            await batch.commit();
            
            processedCount += batchData.length;
            setProcessedRows(processedCount);
            setProgress(Math.floor((processedCount / data.length) * 100));
          }
          
          toast({
            title: "Upload complete",
            description: `Successfully added ${processedCount} incidents to the database.`,
            variant: "default",
          });
          
          // Reset form
          setFile(null);
          setPreview([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          
        } catch (error) {
          console.error("Error uploading incidents:", error);
          toast({
            title: "Upload failed",
            description: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
            variant: "destructive",
          });
        } finally {
          setUploading(false);
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setUploading(false);
        toast({
          title: "Error parsing CSV",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const resetForm = () => {
    setFile(null);
    setPreview([]);
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bulk Upload Incidents</CardTitle>
        <CardDescription>Upload multiple incidents via CSV file</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Input 
              ref={fileInputRef}
              type="file" 
              accept=".csv" 
              onChange={handleFileChange} 
              disabled={uploading}
              className="flex-1"
            />
            <Button 
              onClick={resetForm} 
              variant="outline" 
              disabled={!file || uploading}
            >
              Clear
            </Button>
          </div>
          
          {file && (
            <Alert variant="outline">
              <FileText className="h-4 w-4" />
              <AlertTitle>Selected file</AlertTitle>
              <AlertDescription>
                {file.name} ({(file.size / 1024).toFixed(2)} KB) - {totalRows} records
              </AlertDescription>
            </Alert>
          )}
          
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation Errors</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2">
                  {errors.slice(0, 5).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                  {errors.length > 5 && (
                    <li>...and {errors.length - 5} more errors</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Uploading...</span>
                <span>{processedRows} / {totalRows}</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
          
          {preview.length > 0 && (
            <div>
              <h3 className="text-md font-medium mb-2">Preview (first {preview.length} rows):</h3>
              <div className="bg-muted p-4 rounded-md overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Title</th>
                      <th className="text-left p-2">Description</th>
                      <th className="text-left p-2">Severity</th>
                      <th className="text-left p-2">Sector</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, index) => (
                      <tr key={index} className="border-b border-muted-foreground/20">
                        <td className="p-2">{row.title}</td>
                        <td className="p-2">{row.description?.substring(0, 50)}...</td>
                        <td className="p-2">{row.severity}</td>
                        <td className="p-2">{row.sector || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>CSV Format</AlertTitle>
            <AlertDescription>
              Your CSV file should include the following columns: title, description, severity
              (required) and optionally sector, source, sourceUrl, attackVector, status, 
              indicatorsOfCompromise, affectedSystems.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleUpload} 
              disabled={!file || errors.length > 0 || uploading}
              className="flex gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload Incidents'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkUploadForm; 