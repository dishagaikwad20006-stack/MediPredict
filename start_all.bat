@echo off
REM Start Django backend
start "Backend" cmd /k "cd backend && ..\.venv\Scripts\activate && python manage.py runserver"
REM Start React frontend
start "Frontend" cmd /k "cd frontend && npm start"
