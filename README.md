# MediPredict
MediPredict is a web app for disease detection based on user symptoms.

## Features
- Django backend with REST API for disease prediction
- React frontend for user input and displaying results
- Simple rule-based logic for demo (can be extended with ML)

## Getting Started (quick)

Recommended: run from project root. A helper script `start_all.bat` is provided for Windows.

Backend (Python / Django)

- Create and activate a virtual environment (Windows):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

- Install backend dependencies:

```powershell
pip install -r backend\requirements.txt
```

- Apply migrations and run the server:

```powershell
cd backend
python manage.py migrate
python manage.py runserver
```

- (Optional) Load initial sample diseases for testing:

```powershell
python manage.py loaddata disease_detection/fixtures/initial_diseases.json
```

The backend API will be available at http://localhost:8000/ (the frontend proxies to port 8000).

Frontend (Node / React)

- From project root:

```powershell
cd frontend
npm install
npm start
```

If you prefer a single command on Windows, run `start_all.bat` from the project root (it attempts to start both services).

Notes and troubleshooting

- The backend requirements are in `backend/requirements.txt`.
- The frontend expects React 18; `frontend/package.json` was adjusted accordingly.
- If the frontend fails on install/build, delete `node_modules` and run `npm install` again.
- Keep `.env` secrets out of source control. Use `.env` for keys (a sample `.env.example` can be added).

This project is a demo. For production, remove debug settings, secure secrets, and add proper deployment configuration.

## API Endpoints

- `GET /api/diseases/` — Returns a JSON list of diseases and their symptoms.
- `POST /api/predict/` — Accepts JSON `{ "symptoms": ["fever","cough"] }` and returns predicted diseases ordered by match count.

Example predict response:

```json
{
	"predictions": [
		{ "disease": "Flu", "description": "...", "match_count": 2 }
	]
}
```