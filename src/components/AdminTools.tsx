import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Temporary mock functions until Firebase is properly set up
const populateFirebaseWithSampleData = async (): Promise<{ success: boolean; message: string }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true, message: "Database populated with sample data" });
    }, 1500);
  });
};

const clearFirebaseSampleData = async (): Promise<{ success: boolean; message: string }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true, message: "Sample data cleared from database" });
    }, 1500);
  });
};

const AdminTools = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const handlePopulateDatabase = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const result = await populateFirebaseWithSampleData();
      setResult(result);
      
      if (result.success) {
        toast.success("Database populated successfully!");
      } else {
        toast.error("Failed to populate database");
      }
    } catch (error) {
      console.error("Error in populate function:", error);
      setResult({ success: false, message: `Error: ${error}` });
      toast.error("An error occurred while populating the database");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearDatabase = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const result = await clearFirebaseSampleData();
      setResult(result);
      
      if (result.success) {
        toast.success("Database cleared successfully!");
      } else {
        toast.error("Failed to clear database");
      }
    } catch (error) {
      console.error("Error in clear function:", error);
      setResult({ success: false, message: `Error: ${error}` });
      toast.error("An error occurred while clearing the database");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-16 bg-cybergray-50 dark:bg-cyberdark" id="admin">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-cybergray-900 dark:text-white mb-3">Admin Tools</h2>
            <p className="text-cybergray-600 dark:text-cybergray-400 max-w-2xl mx-auto">
              Use these tools to manage the database for demonstration purposes.
            </p>
          </div>

          <div className="cyber-card mb-8">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-cybergray-900 dark:text-white mb-6">
                Database Management
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-cybergray-800 dark:text-white mb-2">Populate Database</h4>
                  <p className="text-cybergray-600 dark:text-cybergray-400 mb-4">
                    Add sample cyber incidents and preventive measures to the Firebase database.
                  </p>
                  <Button 
                    onClick={handlePopulateDatabase} 
                    disabled={isLoading}
                    className="bg-cyberblue-500 hover:bg-cyberblue-600 text-white"
                  >
                    {isLoading ? "Loading..." : "Populate Database"}
                  </Button>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-cybergray-800 dark:text-white mb-2">Clear Database</h4>
                  <p className="text-cybergray-600 dark:text-cybergray-400 mb-4">
                    Remove all sample data from the Firebase database.
                  </p>
                  <Button 
                    onClick={handleClearDatabase} 
                    disabled={isLoading}
                    variant="destructive"
                  >
                    {isLoading ? "Loading..." : "Clear Database"}
                  </Button>
                </div>
                
                {result && (
                  <div className={`p-4 rounded-md ${result.success ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'}`}>
                    <p className="font-medium">{result.success ? "Success" : "Error"}</p>
                    <p>{result.message}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTools;