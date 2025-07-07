# GreenHub MVP

A comprehensive climate resilience platform designed to support communities in understanding and adapting to climate change impacts.

## Overview

GreenHub MVP is a React-based web application that provides climate data visualization, vulnerability mapping, and resource sharing capabilities for climate adaptation and resilience planning.

## Features

### 🌍 Climate Database
- Access to comprehensive climate data and projections
- Interactive data visualization with charts and graphs
- Historical and future climate trend analysis

### 🗺️ Vulnerability Maps
- Interactive mapping interface using Leaflet
- Climate vulnerability assessments
- Geographic visualization of climate risks

### 📊 Monitoring & Evaluation Dashboard
- National Adaptation Plan (NAP) metrics tracking
- Progress monitoring tools
- Performance indicators visualization

### 💬 Information Sharing
- Community resource sharing platform
- Knowledge exchange capabilities
- Collaborative climate adaptation planning

### 🔐 User Authentication
- Secure login system
- Protected routes for authenticated users
- User context management

## Technology Stack

- **Frontend**: React 18.2.0
- **Routing**: React Router DOM 6.8.1
- **Styling**: Tailwind CSS 3.3.2
- **Maps**: Leaflet 1.9.4 with React Leaflet 4.2.1
- **Charts**: Recharts 2.8.0
- **Icons**: Lucide React 0.294.0
- **Testing**: Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd greehub_mvp
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

#### Development Mode

Start the development server:
```bash
npm start
```

The application will run on `http://0.0.0.0:10000` by default.

#### Custom Port

To run on a different port, set the PORT environment variable:
```bash
PORT=3000 npm start
```

#### Production Build

Create a production build:
```bash
npm run build
```

#### Testing

Run the test suite:
```bash
npm test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Main navigation component
│   ├── SecondaryNav.js # Secondary navigation
│   └── ProtectedRoute.js # Route protection component
├── context/            # React context providers
│   └── AuthContext.js  # Authentication context
├── data/              # Static data files
│   ├── climate_data.json
│   ├── nap_metrics.json
│   ├── resources.json
│   ├── users.json
│   └── vulnerability_map.json
├── pages/             # Page components
│   ├── About.js
│   ├── ClimateDatabase.js
│   ├── InformationSharing.js
│   ├── LandingPage.js
│   ├── Login.js
│   ├── MEDashboard.js
│   └── VulnerabilityMaps.js
├── App.js             # Main application component
├── App.css            # Application styles
├── index.js           # Application entry point
└── index.css          # Global styles
```

## Configuration

### Environment Variables

- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 10000)

### Tailwind CSS

The project uses Tailwind CSS for styling. Configuration can be found in `tailwind.config.js`.

### PostCSS

PostCSS configuration is available in `postcss.config.js` for CSS processing.

## Data Sources

The application uses JSON files for data storage:

- **Climate Data**: Historical and projected climate information
- **NAP Metrics**: National Adaptation Plan monitoring data
- **Resources**: Community resources and knowledge base
- **Users**: User authentication data
- **Vulnerability Maps**: Geographic vulnerability assessments

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security Considerations

- User authentication is implemented with protected routes
- Input validation should be implemented for all user inputs
- Environment variables should be used for sensitive configuration
- Regular security audits should be performed on dependencies

## License

This project is private and proprietary.

## Support

For support and questions, please contact the development team.

---

**Note**: This is an MVP (Minimum Viable Product) version. Additional features and improvements are planned for future releases.