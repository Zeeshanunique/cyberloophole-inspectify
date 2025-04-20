import { mockIncidents, mockPreventiveMeasures, mockThreatActors, mockDataSources } from "./mockData";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, writeBatch } from "firebase/firestore";

/**
 * Populates Firebase with sample data for demonstration purposes
 */
export const populateFirebaseWithSampleData = async () => {
  try {
    const db = getFirestore();
    
    // Check if collections already have documents
    const incidentsSnapshot = await getDocs(collection(db, "incidents"));
    if (!incidentsSnapshot.empty) {
      return { 
        success: false, 
        message: "Database already contains incidents. Please clear the database first." 
      };
    }
    
    // Add incidents
    const incidentsCollection = collection(db, "incidents");
    for (const incident of mockIncidents) {
      await addDoc(incidentsCollection, incident);
    }
    
    // Add preventive measures
    const measuresCollection = collection(db, "preventiveMeasures");
    for (const measure of mockPreventiveMeasures) {
      await addDoc(measuresCollection, measure);
    }
    
    // Add threat actors
    const actorsCollection = collection(db, "threatActors");
    for (const actor of mockThreatActors) {
      await addDoc(actorsCollection, actor);
    }
    
    // Add data sources
    const sourcesCollection = collection(db, "dataSources");
    for (const source of mockDataSources) {
      await addDoc(sourcesCollection, source);
    }
    
    // Create admin user if it doesn't exist
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    if (usersSnapshot.empty) {
      await addDoc(usersCollection, {
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        createdAt: new Date().toISOString()
      });
    }
    
    return { 
      success: true, 
      message: `Successfully populated database with ${mockIncidents.length} incidents, ${mockPreventiveMeasures.length} preventive measures, ${mockThreatActors.length} threat actors, and ${mockDataSources.length} data sources.` 
    };
  } catch (error) {
    console.error("Error populating Firebase:", error);
    return { 
      success: false, 
      message: `Failed to add sample data: ${error}` 
    };
  }
};

/**
 * Clears all sample data from Firebase
 */
export const clearFirebaseSampleData = async () => {
  try {
    const db = getFirestore();
    const batch = writeBatch(db);
    let count = 0;
    
    // Clear incidents
    const incidentsCollection = collection(db, "incidents");
    const incidentsSnapshot = await getDocs(incidentsCollection);
    incidentsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
      count++;
    });
    
    // Clear preventive measures
    const measuresCollection = collection(db, "preventiveMeasures");
    const measuresSnapshot = await getDocs(measuresCollection);
    measuresSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
      count++;
    });
    
    // Clear threat actors
    const actorsCollection = collection(db, "threatActors");
    const actorsSnapshot = await getDocs(actorsCollection);
    actorsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
      count++;
    });
    
    // Clear data sources
    const sourcesCollection = collection(db, "dataSources");
    const sourcesSnapshot = await getDocs(sourcesCollection);
    sourcesSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
      count++;
    });
    
    // Commit the batch
    await batch.commit();
    
    return { 
      success: true, 
      message: `Successfully cleared ${count} documents from the database.` 
    };
  } catch (error) {
    console.error("Error clearing Firebase data:", error);
    return { 
      success: false, 
      message: `Failed to clear sample data: ${error}` 
    };
  }
};