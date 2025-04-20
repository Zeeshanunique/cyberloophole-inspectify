# Firebase Migration Guide

This document outlines the migration from Supabase to Firebase for the Cyberloophole Inspectify application.

## Migration Overview

The application has been migrated from Supabase to Firebase to better align with project requirements. The migration involved:

1. Replacing Supabase client with Firebase configuration
2. Creating Firebase Firestore database services
3. Updating data models and queries
4. Modifying components to use Firebase instead of Supabase

## Firebase Configuration

The Firebase configuration is stored in `src/integrations/firebase/config.ts`:

```typescript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCG0YfkSofUMdwX0H4m-YJJ7r6NZAKZPQg",
  authDomain: "cyberloop-3da6d.firebaseapp.com",
  projectId: "cyberloop-3da6d",
  storageBucket: "cyberloop-3da6d.firebasestorage.app",
  messagingSenderId: "549245276493",
  appId: "1:549245276493:web:505c3b5235a692f5b9a704",
  measurementId: "G-6THL6W9QNB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
```

## Database Structure

The Firebase Firestore database has the following collections:

1. `cyber_incidents` - Stores information about cyber security incidents
2. `preventive_measures` - Stores preventive measures linked to incidents

## Data Initialization

A database seeding utility has been created to populate the Firebase database with initial data. This can be triggered using the "Initialize Firebase Database" button that appears at the bottom right of the application.

The seeding logic is in `src/utils/seedFirebase.ts`.

## Application Features

The application maintains all the original features:

1. Finding loopholes in specific software
2. Determining the source of security threats
3. Analyzing the nature of threats (attack type and impact)
4. Suggesting preventive measures

## Development Notes

- Firebase queries are in `src/utils/firebaseQueries.ts`
- Firebase data types are in `src/integrations/firebase/types.ts`
- The application uses React Query for data fetching, which made the migration smoother

## Future Improvements

- Add authentication using Firebase Authentication
- Implement real-time updates using Firestore listeners
- Add Firebase Cloud Functions for server-side logic