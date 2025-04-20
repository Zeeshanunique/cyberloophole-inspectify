import { useEffect, useState } from "react";
import { seedDatabase, seedIncidents } from "@/utils/seedFirebase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import LoadingSpinner from "./LoadingSpinner";

const FirebaseInitializer = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if data already exists when component mounts
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        // Check if data exists by attempting to get incidents
        const incidentsCount = await seedIncidents();
        setIsInitialized(incidentsCount > 0);
      } catch (error) {
        console.error("Error checking database:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkDatabase();
  }, []);

  const handleInitializeDatabase = async () => {
    setIsInitializing(true);
    try {
      await seedDatabase();
      setIsInitialized(true);
      toast.success("Firebase database initialized successfully!");
    } catch (error) {
      console.error("Error initializing database:", error);
      toast.error("Failed to initialize database");
    } finally {
      setIsInitializing(false);
    }
  };

  if (isChecking) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white dark:bg-cyberdark p-3 rounded-lg shadow-md flex items-center space-x-2">
          <LoadingSpinner size="small" message={null} />
          <span className="text-sm">Checking database...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isInitialized && (
        <Button
          onClick={handleInitializeDatabase}
          disabled={isInitializing}
          className="bg-cyberblue-500 hover:bg-cyberblue-600 text-white flex items-center gap-2"
        >
          {isInitializing ? (
            <>
              <LoadingSpinner size="small" message={null} />
              <span>Initializing...</span>
            </>
          ) : (
            "Initialize Firebase Database"
          )}
        </Button>
      )}
    </div>
  );
};

export default FirebaseInitializer;