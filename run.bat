@echo off
echo ===================================================
echo 🚀 STARTING THUNDRA AI WORKSPACE SERVERS
echo ===================================================

:: Start Backend in a new command window
echo 📡 Starting Backend Server (Port 5000)...
start cmd /k "cd backend && node server.js"

:: Start Frontend in a new command window
echo 💻 Starting Frontend Dev Server (Port 5173)...
start cmd /k "cd frontend && npm run dev || npx vite"

echo ===================================================
echo 🎉 Both servers have been launched in separate windows!
echo ➜ Backend is running at: http://localhost:5000
echo ➜ Frontend is running at: http://localhost:5173
echo ===================================================
pause
