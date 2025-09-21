# AgroSmart - Smart Irrigation Management System

A modern React/TypeScript frontend for the AgroSmart Smart Irrigation Management System, featuring real-time monitoring, zone-based pump control, and comprehensive analytics.

## 🚀 Features

- **Real-time Sensor Monitoring**: Live data for soil moisture, sunlight, rainfall, pH levels, and tank levels
- **Zone-Based Pump Control**: Smart irrigation with Zone 1 and Zone 2 controls
- **User Authentication**: Secure login/signup with Firebase Auth
- **Interactive Analytics**: Historical data visualization with dynamic time periods (24h, 7d, 30d)
- **Responsive Design**: Modern UI with Tailwind CSS and Shadcn UI
- **Firebase Integration**: Real-time database and authentication
- **Smart Pump Logic**: Main pump automatically manages based on active zones

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, Shadcn UI, Radix UI
- **Charts**: Recharts for data visualization
- **Backend**: Firebase (Realtime Database, Authentication)
- **State Management**: React Hooks, TanStack Query
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (Shadcn/UI)
│   ├── AuthLogin.tsx   # Authentication component
│   ├── AuthWrapper.tsx # Authentication wrapper
│   ├── Dashboard.tsx   # Main dashboard with sensor data
│   ├── Charts.tsx      # Data visualization and analytics
│   ├── Reports.tsx     # Usage reports and insights
│   ├── Settings.tsx    # System configuration
│   └── Navigation.tsx  # Navigation component
├── firebase/           # Firebase configuration
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── useSensorData.ts # Sensor data management
│   └── usePumpControl.ts # Pump control logic
├── services/           # API services
│   ├── authService.ts  # Authentication service
│   └── dataService.ts  # Data management service
├── pages/              # Page components
└── lib/                # Utility functions
```

## 🔧 Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Nachiketa-Singamsetty/AgroSmart.git
   cd AgroSmart
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🔥 Firebase Configuration

The app is configured to connect to:
- **Project ID**: `final-project-f42c4`
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Auth
- **Region**: Asia-Southeast1

## 📊 Key Features

### **Dashboard**
- Real-time sensor monitoring (Soil Moisture, Sunlight, Rainfall, pH Level, Tank Level)
- Zone-based pump control (Zone 1 & Zone 2)
- Smart main pump logic (automatically manages based on active zones)
- Connection status indicators

### **Analytics**
- Dynamic time periods (24 Hours, 7 Days, 30 Days)
- Interactive charts with Recharts
- Sensor data trends and patterns
- Export functionality (PDF, CSV, Excel)

### **Reports**
- Usage analytics and insights
- Water consumption tracking
- Efficiency metrics
- Historical data reports

### **Settings**
- System configuration
- Irrigation parameters
- Notification preferences
- Sensor calibration

## 🎯 Smart Pump Control

- **Zone 1 & Zone 2**: Independent irrigation zone controls
- **Smart Logic**: Main pump automatically turns ON when any zone is active
- **Auto Management**: Main pump turns OFF when all zones are inactive
- **Real-time Status**: Live pump and zone status updates

## 🚀 Getting Started

1. **Authentication**: Sign up or sign in to access the system
2. **Dashboard**: View real-time sensor data and control irrigation zones
3. **Analytics**: Navigate to Charts tab for historical data visualization
4. **Reports**: Check usage analytics and system insights
5. **Settings**: Configure system parameters and preferences

## 🔒 Security

- Firebase Authentication for secure user management
- Real-time data validation and sanitization
- Secure API endpoints with Firebase rules
- Input validation and error handling
- Protected routes and authentication guards

## 📱 Responsive Design

- Mobile-first approach with desktop optimization
- Touch-friendly interface for mobile devices
- Custom irrigation theme with professional styling
- Accessibility features and keyboard navigation

## 🛠️ Development

### **Available Scripts**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### **Environment Setup**
- Node.js 18+ required
- Modern browser with ES6+ support
- Firebase project configuration

## 📄 License

This project is part of the AgroSmart Smart Irrigation Management System.

---

**AgroSmart** - Revolutionizing agricultural irrigation with smart technology
