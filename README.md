# CyberLoophole Inspectify

## Project Overview

CyberLoophole Inspectify is a comprehensive cyber threat intelligence platform designed specifically for monitoring, analyzing, and responding to cyber incidents affecting Indian information infrastructure. The platform provides real-time analytics, visualizations, and insights to help cybersecurity professionals, organizations, and government agencies protect critical systems.

## Features

### 🛡️ Comprehensive Incident Monitoring
- Real-time tracking of cyber incidents
- Detailed incident reporting with severity classification
- Historical incident database with search capabilities

### 📊 Advanced Analytics
- Sector-specific incident distribution
- Attack vector analysis
- Severity classification statistics
- Temporal trend analysis
- Threat actor tracking

### 🔍 Threat Intelligence
- Strategic recommendations based on data patterns
- Vulnerability assessments
- Sector vulnerability matrix
- Automated data collection from various sources

### 📱 User-Friendly Interface
- Responsive design for all devices
- Intuitive dashboard for quick insights
- Detailed visualization of complex data
- Dark and light mode support

## Screenshots

### Landing Page
Modern landing page with real-time incident statistics and sector information.

### Dashboard
Comprehensive overview of recent incidents, threat analysis, and key security metrics.

### Analytics
In-depth data visualization with sector analysis, attack vectors, and trend reporting.

### Incidents Management
Detailed incident tracking and management with severity classification.

## Technologies Used

This project is built with:

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn-ui
- **Styling**: Tailwind CSS
- **Data Visualization**: Recharts
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Deployment**: Firebase Hosting

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cyberloophole-inspectify
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
cyberloophole-inspectify/
├── public/               # Static assets
│   ├── components/       # Reusable UI components
│   │   └── ui/           # Base UI components from shadcn/ui
│   ├── contexts/         # React context providers
│   │   └── AuthContext.tsx  # Authentication context
│   ├── pages/            # Application pages
│   │   ├── Analytics.tsx    # Data visualization and insights
│   │   ├── Dashboard.tsx    # Main dashboard view
│   │   ├── Incidents.tsx    # Incident listing and management
│   │   └── Landing.tsx      # Public landing page
│   ├── services/         # Service layers for data handling
│   │   ├── AnalyticsService.ts   # Analytics data processing
│   │   └── DataService.ts        # Database operations
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── index.html            # HTML entry point
└── package.json          # Project dependencies and scripts
```

## Key Pages

- **Landing Page**: Public-facing information about the platform
- **Dashboard**: Overview of recent incidents and key metrics
- **Incidents**: Comprehensive listing of all cyber incidents with filtering
- **Analytics**: In-depth data analysis and visualizations
- **Admin**: For administrators to manage the platform (restricted access)

## Data Model

- **Incidents**: Cyber incidents with details like severity, sector, date, etc.
- **Threats**: Known threat actors and their activities
- **Vulnerabilities**: Identified vulnerabilities in different sectors

## Future Enhancements

- Integration with external threat intelligence feeds
- Advanced machine learning for pattern recognition
- Mobile application for on-the-go monitoring
- API for third-party integrations
- Advanced notification system

## Development Workflow

### Local Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run tests
npm test
```

## Deployment

The application can be deployed to Firebase Hosting:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init

# Deploy to Firebase
firebase deploy
```

## Contributors

- Team CyberLoophole Inspectify

## License

This project is proprietary and confidential.

---

© 2023 CyberLoophole Inspectify. All rights reserved.
