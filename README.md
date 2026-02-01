# Gym Progress Tracker

A modern, offline-first Progressive Web App (PWA) for tracking gym workouts and visualizing fitness progress.

![Gym Progress Tracker](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)
![PWA](https://img.shields.io/badge/PWA-Enabled-green)

## ✨ Features

- 💪 **Workout Logging** - Track sets, reps, and weight for every exercise
- 📋 **Exercise Database** - 40+ pre-loaded exercises with search and filtering
- 📊 **Workout History** - View and review all past workouts
- 📈 **Progress Charts** - Visualize strength gains over time
- 🎨 **Premium Dark Theme** - Modern UI with smooth animations
- 📱 **Mobile-First PWA** - Installable and works offline
- 💾 **Local Storage** - All data stored in your browser (IndexedDB)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/gym-progress-tracker.git
cd gym-progress-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 6
- **Database**: IndexedDB (Dexie.js)
- **Charts**: Recharts
- **PWA**: vite-plugin-pwa
- **Styling**: Vanilla CSS with modern design system

## 📱 Usage

1. **Browse Exercises** - View 40+ exercises organized by muscle group
2. **Log Workout** - Search for exercises and track your sets
3. **View History** - Review past workouts with detailed breakdowns
4. **Track Progress** - Visualize your strength gains with interactive charts

## 🎯 Key Features

### Offline-First
All data is stored locally in IndexedDB - no internet required after initial load.

### Progressive Web App
Install on any device for an app-like experience:
- Desktop: Click install icon in browser address bar
- Mobile: Add to home screen

### Privacy-Focused
Your workout data never leaves your device. No accounts, no tracking, no servers.

## 🗂️ Project Structure

```
gym-progress-tracker/
├── src/
│   ├── components/       # React components
│   ├── db/              # Database schema and utilities
│   ├── styles/          # CSS files
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── index.html           # HTML template
└── vite.config.js       # Vite configuration
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

Built with modern web technologies and best practices for a fast, reliable user experience.

---

**Made with 💪 for fitness enthusiasts**
