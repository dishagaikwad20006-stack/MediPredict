
import numpy as np
from sklearn.ensemble import RandomForestClassifier

# Expanded symptoms and diseases (example, can be replaced with real data)
symptom_list = [
    'fever', 'cough', 'headache', 'fatigue', 'sore throat', 'runny nose', 'nausea', 'vomiting', 'diarrhea', 'rash',
    'chills', 'body ache', 'loss of taste', 'loss of smell', 'shortness of breath', 'chest pain', 'dizziness', 'sweating', 'joint pain', 'abdominal pain'
]
disease_list = ['Flu', 'Common Cold', 'Migraine', 'Food Poisoning', 'COVID-19', 'Malaria', 'Dengue', 'Typhoid']

# Example training data (rows: patients, columns: symptoms)
X = np.array([
    # Flu
    [1,1,0,1,1,1,0,0,0,0,1,1,0,0,0,0,0,1,0,0],
    # Common Cold
    [0,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    # Migraine
    [0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1],
    # Food Poisoning
    [0,0,0,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
    # COVID-19
    [1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
    # Malaria
    [1,0,0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,0,0],
    # Dengue
    [1,0,0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,0],
    # Typhoid
    [1,0,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
])
y = np.array([0,1,2,3,4,5,6,7])  # Disease indices

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)


# Disease details (example data)
