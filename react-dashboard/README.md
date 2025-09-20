# Live Screen Analysis Dashboard - React Version

A modern, real-time React dashboard for live screen capture and AI analysis with Socket.IO streaming.

## 🚀 Features

- **Real-time Screenshot Gallery** - Live image capture and display
- **Streaming Analysis Feed** - AI analysis results in real-time
- **Performance Metrics** - Live stats and success rates
- **Modern UI** - Dark theme with glassmorphism effects
- **Responsive Design** - Mobile and desktop support
- **WebSocket Integration** - Real-time communication with Flask backend

## 🛠 Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time communication
- **Modern React Hooks** for state management

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Start the Flask backend** (in another terminal):
   ```bash
   cd .. && python dashboard.py
   ```

4. **Open your browser:**
   - React app: http://localhost:3000
   - Flask backend: http://localhost:8080

## 🎯 Usage

1. Make sure the Flask backend is running on port 8080
2. Open the React dashboard at http://localhost:3000
3. Click "Start" to begin live monitoring
4. Watch real-time screenshots and AI analysis
5. Click "Stop" to end monitoring

## 🏗 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Top navigation and controls
│   ├── ScreenshotGallery.tsx  # Live image display
│   ├── AnalysisStream.tsx     # Analysis feed
│   └── MetricsBar.tsx         # Performance stats
├── hooks/              # Custom React hooks
│   └── useSocket.ts    # Socket.IO integration
├── types/              # TypeScript definitions
│   └── index.ts        # App interfaces
└── App.tsx             # Main application
```

## 🔧 Configuration

The dashboard connects to the Flask backend at `http://localhost:8080` by default.

To change the backend URL, update the `SOCKET_URL` constant in `src/App.tsx`:

```typescript
const SOCKET_URL = 'http://localhost:8080';
```

## 📱 Mobile Support

The dashboard is fully responsive and works on mobile devices with:
- Touch-friendly controls
- Responsive grid layouts
- Mobile-optimized navigation

## 🎨 Customization

### Colors
Customize the color scheme in `tailwind.config.js`:

```javascript
colors: {
  'dark-bg': '#0c0c0c',
  'dark-secondary': '#1a1a1a',
  'accent-red': '#ff4444',
  'accent-green': '#00ff88',
  'accent-blue': '#00aaff',
}
```

### Animation
Modify animations in `tailwind.config.js` or add custom CSS.

## 🚀 Production Build

Create an optimized production build:

```bash
npm run build
```

The build folder will contain the optimized files ready for deployment.

## 🐛 Troubleshooting

**Connection Issues:**
- Ensure Flask backend is running on port 8080
- Check browser console for WebSocket errors
- Verify CORS settings if needed

**Build Issues:**
- Run `npm install` to update dependencies
- Clear cache: `npm start -- --reset-cache`

## 📄 License

MIT License - feel free to use and modify for your projects.
