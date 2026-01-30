# MediPredict

MediPredict is a web app for disease detection based on user symptoms.

## Features
- Django backend with REST API for disease prediction
- React frontend for user input and displaying results
- Simple rule-based logic for demo (can be extended with ML)

## Getting Started

### Backend (Django)
1. Navigate to `backend` directory:
	```sh
	cd backend
	```
2. Install dependencies (already installed if using provided venv):
	```sh
	../.venv/Scripts/python.exe -m pip install django djangorestframework scikit-learn
	```
3. Run migrations:
	```sh
	../.venv/Scripts/python.exe manage.py migrate
	```
4. Start the server:
	```sh
	../.venv/Scripts/python.exe manage.py runserver
	```
	The API will be available at `http://localhost:8000/api/predict/`.

### Frontend (React)
1. Navigate to `frontend` directory:
	```sh
	cd ../frontend
	```
2. Initialize React app (if not already):
	```sh
	npx create-react-app .
	```
3. Replace `src` contents with provided files (`App.js`, `App.css`, `index.js`, `index.html`).
4. Start the React app:
	```sh
	npm start
	```
	The frontend will be available at `http://localhost:3000`.

## Usage
- Select symptoms and click "Predict Disease".
- The predicted disease will be shown below the form.

---

This is a demo. For production, improve security, error handling, and ML logic.
# MediPredict