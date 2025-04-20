import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AddIncidentForm } from '../components/AddIncidentForm';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AddIncident = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-cybergray-50 dark:bg-cyberdark">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-cybergray-900 dark:text-white">Add New Incident</h1>
              <p className="text-cybergray-600 dark:text-cybergray-400">
                Add a new cyber incident to the database
              </p>
            </div>
          </div>
          
          <AddIncidentForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AddIncident; 