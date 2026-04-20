# Task Manager Frontend

A modern React-based frontend application for task management, built with Vite, Tailwind CSS, and Chart.js for data visualization.

## 🚀 Features

- **Task Management**: Create, read, update, and delete tasks
- **Data Visualization**: Interactive charts and analytics using Chart.js
- **Modern UI**: Clean, responsive interface built with Tailwind CSS
- **Routing**: Client-side navigation with React Router
- **API Integration**: Seamless communication with backend via Axios
- **Icons**: Beautiful icons from Lucide React

## 🛠️ Tech Stack

- **React 18.3.1** - Modern React with hooks
- **Vite 5.4.8** - Fast development server and build tool
- **Tailwind CSS 3.4.11** - Utility-first CSS framework
- **React Router 6.26.0** - Client-side routing
- **Axios 1.7.7** - HTTP client for API calls
- **Chart.js 4.4.4** - Data visualization library
- **React Chart.js 2 5.2.0** - React wrapper for Chart.js
- **Lucide React 0.439.0** - Icon library

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── dist/                  # Production build output
├── Dockerfile             # Docker configuration
├── nginx.conf             # Nginx configuration for production
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite configuration
└── postcss.config.js      # PostCSS configuration
```

## 🐳 Docker Deployment

The application includes Docker support for containerized deployment:

```bash
# Build the Docker image
docker build -t task-manager-frontend .

# Run the container
docker run -p 80:80 task-manager-frontend
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
VITE_API_URL=http://localhost:8000/api
```

### Tailwind CSS

The project uses Tailwind CSS for styling. Configuration is available in `tailwind.config.js`.

## 📊 API Integration

The frontend communicates with a backend API through Axios. Base URL and other API configurations can be set via environment variables.

## 🎨 Styling

- **Tailwind CSS**: Used for utility-first styling
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Component Styling**: Co-located styles with components

## 📈 Charts and Analytics

The application includes data visualization features using Chart.js:
- Task completion charts
- Progress tracking
- Analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: The development server might use a different port if 3000 is occupied
2. **Build errors**: Ensure all dependencies are properly installed
3. **API connection issues**: Verify the backend API is running and accessible

### Getting Help

- Check the browser console for error messages
- Verify all dependencies are installed correctly
- Ensure the backend API is running and accessible

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.
