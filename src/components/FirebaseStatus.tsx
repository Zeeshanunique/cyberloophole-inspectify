import React, { useEffect, useState } from 'react';
import { db } from '@/integrations/firebase/config';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const FirebaseStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [message, setMessage] = useState<string>('Checking connection to Firebase...');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to fetch a single document from any collection
        const incidentsRef = collection(db, 'cyber_incidents');
        const q = query(incidentsRef, limit(1));
        await getDocs(q);
        
        setStatus('connected');
        setMessage('Connected to Firebase');
      } catch (error) {
        console.error('Firebase connection error:', error);
        setStatus('error');
        setMessage('Error connecting to Firebase');
      }
    };

    checkConnection();
  }, []);

  // Auto-hide after 5 seconds if connected
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'connected') {
      timer = setTimeout(() => {
        setStatus('checking');
        setMessage('');
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [status]);

  if (status === 'checking' && !message) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white dark:bg-cyberdark shadow-md rounded-lg p-3 flex items-center space-x-2 animate-fade-in">
      {status === 'checking' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
      {status === 'connected' && <CheckCircle className="h-5 w-5 text-green-500" />}
      {status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default FirebaseStatus;