import os
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import requests

# Expanded symptoms and diseases (example, can be replaced with real data)

# Expanded symptoms and diseases
symptom_list = [
    'fever', 'cough', 'headache', 'fatigue', 'sore throat', 'runny nose', 'nausea', 'vomiting', 'diarrhea', 'rash',
    'chills', 'body ache', 'loss of taste', 'loss of smell', 'shortness of breath', 'chest pain', 'dizziness', 'sweating', 'joint pain', 'abdominal pain',
    'weight loss', 'night sweats', 'swollen glands', 'blurred vision', 'itching', 'yellow skin', 'dark urine', 'back pain', 'constipation', 'palpitations',
    'anxiety', 'insomnia', 'loss of appetite', 'muscle pain', 'red eyes', 'ear pain', 'hearing loss', 'skin ulcers', 'bleeding', 'confusion', 'seizures', 'stiff neck',
    'difficulty swallowing', 'hoarseness', 'swelling', 'increased thirst', 'frequent urination', 'dry mouth', 'hair loss', 'sensitivity to light', 'sensitivity to sound', 'numbness',
    'tingling', 'cold hands', 'cold feet', 'easy bruising', 'slow healing', 'frequent infections', 'irritability', 'restlessness', 'weight gain', 'excessive sweating'
]
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

disease_list = [
    'Flu', 'Common Cold', 'Migraine', 'Food Poisoning', 'COVID-19', 'Malaria', 'Dengue', 'Typhoid',
    'Tuberculosis', 'Hepatitis', 'Meningitis', 'Hypertension', 'Diabetes', 'Chickenpox', 'Measles', 'Jaundice', 'Pneumonia', 'Otitis Media', 'Epilepsy', 'Depression', 'Allergy'
]

# Map common UI symptom names to backend tokens
synonym_map = {
    'body pain': 'body ache',
    'stomach pain': 'abdominal pain',
    'stomach ache': 'abdominal pain',
    'tummy pain': 'abdominal pain',
    'belly pain': 'abdominal pain',
    'skin rash': 'rash',
    'hives': 'rash',
    'itchy skin': 'rash',
    'urticaria': 'rash',
    'shortness of breath': 'shortness of breath',
    'runny nose': 'runny nose',
    'sore throat': 'sore throat',
    'chest pain': 'chest pain',
    'dizziness': 'dizziness',
    'fatigue': 'fatigue',
    'headache': 'headache',
    'cough': 'cough',
    'fever': 'fever',
    'nausea': 'nausea',
    'vomiting': 'vomiting',
    'diarrhea': 'diarrhea',
    'allergy': 'rash',  # approximate mapping
}

# Expanded training data (rows: patients, columns: symptoms)
# Ensure all rows in X have the same length as symptom_list (42 features)
_X_raw = [
    # Flu
    [1,1,0,1,1,1,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    # Common Cold
    [0,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    # Migraine
    [0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    # Food Poisoning
    [0,0,0,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    # COVID-19
    [1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    # Malaria
    [1,0,0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    # Dengue
    [1,0,0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    # Typhoid
    [1,0,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    # Tuberculosis
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    # Hepatitis
    [1,0,0,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
    # Meningitis
    [1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    # Hypertension
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0],
    # Diabetes
    [0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0],
    # Chickenpox
    [1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0],
    # Measles
    [1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0],
    # Jaundice
    [1,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
    # Pneumonia
    [1,1,0,1,1,1,0,0,0,0,1,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    # Otitis Media
    [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,1,1,1,0,0,0],
    # Epilepsy
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
    # Depression
    [0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0],
    # Allergy
    [
        0,0,0,0,0,0,0,0,0,1, # rash
        0,0,0,0,0,0,0,0,0,0, # to abdominal pain
        0,0,1,0,0,0,0,0,0,0, # itching at index 24
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,
        0,0
    ],
]
# Pad each row to match the length of symptom_list
for row in _X_raw:
    while len(row) < len(symptom_list):
        row.append(0)

# Add more diverse and realistic samples for each disease
# Data augmentation with correct label count
import random
augmented_X = []
augmented_y = []
for idx, base_row in enumerate(_X_raw):
    # Add the original row
    augmented_X.append(list(base_row))
    augmented_y.append(idx)
    # Add 10 random variations for each disease
    for _ in range(10):
        new_row = list(base_row)
        flip_count = random.randint(2, 5)
        flip_indices = random.sample(range(len(symptom_list)), flip_count)
        for i in flip_indices:
            new_row[i] = 1 if random.random() > 0.5 else 0
        augmented_X.append(new_row)
        augmented_y.append(idx)
X = np.array(augmented_X)
y = np.array(augmented_y)
# y is now set by the augmentation code below


def _to_feature_vector(symptoms_norm):
    """Binary feature vector for normalized symptoms."""
    return np.array([[1 if s in symptoms_norm else 0 for s in symptom_list]])


def get_trained_model():
    model = RandomForestClassifier(n_estimators=200, max_depth=None, random_state=42, class_weight='balanced')
    model.fit(X, y)
    return model

model = get_trained_model()


def _gemini_summary(disease, normalized_symptoms, details):
    """Generate a brief explanation using Gemini if API key is set."""
    if not GEMINI_API_KEY:
        return None
    try:
        prompt = (
            "Provide a concise, non-diagnostic summary in plain language for the likely condition given the symptoms. "
            f"Disease: {disease}. Symptoms: {', '.join(sorted(normalized_symptoms)) or 'None'}. "
            f"Description: {details.get('description', '')}. "
            f"Suggested medicines: {', '.join(details.get('medications', []))}. "
            f"Home remedies: {', '.join(details.get('remedies', []))}. "
            "Keep it under 80 words. Do not give medical advice beyond general guidance."
        )
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
        resp = requests.post(
            url,
            params={"key": GEMINI_API_KEY},
            headers={"Content-Type": "application/json"},
            json={"contents": [{"parts": [{"text": prompt}]}]},
            timeout=8,
        )
        data = resp.json()
        text = (
            data.get('candidates', [{}])[0]
                .get('content', {})
                .get('parts', [{}])[0]
                .get('text')
        )
        return text
    except Exception:
        return None


# Disease details (example data)
disease_details = {
    'Flu': {
        'description': 'A common viral infection causing fever, chills, and body aches.',
        'medications': ['Paracetamol', 'Ibuprofen'],
        'remedies': ['Rest', 'Hydration', 'Warm fluids']
    },
    'Common Cold': {
        'description': 'A mild viral infection of the nose and throat.',
        'medications': ['Antihistamines', 'Decongestants'],
        'remedies': ['Rest', 'Steam inhalation', 'Honey']
    },
    'Migraine': {
        'description': 'A severe headache often accompanied by nausea and sensitivity to light.',
        'medications': ['Aspirin', 'Triptans'],
        'remedies': ['Dark room', 'Cold compress', 'Rest']
    },
    'Food Poisoning': {
        'description': 'Illness caused by eating contaminated food.',
        'medications': ['ORS', 'Antiemetics'],
        'remedies': ['Hydration', 'Rest', 'Bland diet']
    },
    'COVID-19': {
        'description': 'A respiratory illness caused by coronavirus.',
        'medications': ['Paracetamol', 'Cough syrup'],
        'remedies': ['Isolation', 'Hydration', 'Rest']
    },
    'Malaria': {
        'description': 'A mosquito-borne disease causing fever and chills.',
        'medications': ['Chloroquine', 'Artemisinin'],
        'remedies': ['Rest', 'Hydration', 'Avoid mosquito bites']
    },
    'Dengue': {
        'description': 'A viral infection transmitted by mosquitoes.',
        'medications': ['Paracetamol'],
        'remedies': ['Rest', 'Hydration', 'Avoid mosquito bites']
    },
    'Typhoid': {
        'description': 'A bacterial infection causing high fever and abdominal pain.',
        'medications': ['Antibiotics'],
        'remedies': ['Rest', 'Hydration', 'Bland diet']
    },
    'Tuberculosis': {
        'description': 'A serious infectious disease that mainly affects the lungs.',
        'medications': ['Isoniazid', 'Rifampicin'],
        'remedies': ['Rest', 'Good nutrition', 'Medication adherence']
    },
    'Hepatitis': {
        'description': 'Inflammation of the liver, often caused by viruses.',
        'medications': ['Antivirals', 'Interferon'],
        'remedies': ['Rest', 'Avoid alcohol', 'Healthy diet']
    },
    'Meningitis': {
        'description': 'Inflammation of brain and spinal cord membranes.',
        'medications': ['Antibiotics', 'Corticosteroids'],
        'remedies': ['Hospital care', 'Fluids', 'Rest']
    },
    'Hypertension': {
        'description': 'High blood pressure, often with no symptoms.',
        'medications': ['ACE inhibitors', 'Beta blockers'],
        'remedies': ['Low-salt diet', 'Exercise', 'Weight loss']
    },
    'Diabetes': {
        'description': 'A group of diseases that result in too much sugar in the blood.',
        'medications': ['Insulin', 'Metformin'],
        'remedies': ['Diet control', 'Exercise', 'Weight management']
    },
    'Chickenpox': {
        'description': 'A highly contagious viral infection causing an itchy rash.',
        'medications': ['Antihistamines', 'Acyclovir'],
        'remedies': ['Calamine lotion', 'Oatmeal baths', 'Rest']
    },
    'Measles': {
        'description': 'A viral infection that causes a total-body skin rash and flu-like symptoms.',
        'medications': ['Vitamin A', 'Fever reducers'],
        'remedies': ['Rest', 'Hydration', 'Isolation']
    },
    'Jaundice': {
        'description': 'Yellowing of the skin and eyes due to liver issues.',
        'medications': ['Treat underlying cause'],
        'remedies': ['Rest', 'Hydration', 'Avoid alcohol']
    },
    'Pneumonia': {
        'description': 'Infection that inflames air sacs in one or both lungs.',
        'medications': ['Antibiotics', 'Antivirals'],
        'remedies': ['Rest', 'Fluids', 'Hospital care if severe']
    },
    'Otitis Media': {
        'description': 'Middle ear infection, common in children.',
        'medications': ['Antibiotics', 'Pain relievers'],
        'remedies': ['Warm compress', 'Rest', 'Fluids']
    },
    'Epilepsy': {
        'description': 'A disorder in which nerve cell activity in the brain is disturbed, causing seizures.',
        'medications': ['Anticonvulsants'],
        'remedies': ['Medication adherence', 'Avoid triggers']
    },
    'Depression': {
        'description': 'A mood disorder causing persistent feelings of sadness and loss of interest.',
        'medications': ['SSRIs', 'Therapy'],
        'remedies': ['Counseling', 'Exercise', 'Support groups']
    },
    'Allergy': {
        'description': 'An immune response to a substance that is typically harmless, often causing rash or itching.',
        'medications': ['Antihistamines', 'Topical corticosteroids'],
        'remedies': ['Avoid triggers', 'Cool compresses', 'Moisturizers']
    }
}

def predict_disease(symptoms):
    # Normalize input symptoms (lowercase, trim, map synonyms)
    normalized = []
    for s in symptoms:
        key = (s or '').strip().lower()
        key = synonym_map.get(key, key)
        normalized.append(key)

    # Rule-based scoring to improve precision for key symptoms
    rule_weights = {
        'abdominal pain': {'Food Poisoning': 4, 'Typhoid': 3, 'Jaundice': 2},
        'vomiting': {'Food Poisoning': 3, 'Typhoid': 2},
        'diarrhea': {'Food Poisoning': 4, 'Typhoid': 3},
        'nausea': {'Food Poisoning': 2, 'Migraine': 1},
        'fever': {'Flu': 2, 'Dengue': 2, 'Malaria': 2, 'Typhoid': 2, 'COVID-19': 1},
        'body ache': {'Flu': 2, 'Dengue': 2},
        'headache': {'Migraine': 4, 'Dengue': 2},
        'cough': {'Common Cold': 3, 'Pneumonia': 2, 'COVID-19': 1},
        'runny nose': {'Common Cold': 3},
        'sore throat': {'Common Cold': 2, 'COVID-19': 1},
        'shortness of breath': {'Pneumonia': 3, 'COVID-19': 2},
        'chest pain': {'Pneumonia': 3, 'Hypertension': 2},
        'dizziness': {'Migraine': 2, 'Hypertension': 2},
        'joint pain': {'Dengue': 3},
        'rash': {'Allergy': 5, 'Chickenpox': 3, 'Measles': 3, 'Dengue': 2},
        'itching': {'Allergy': 5},
        'loss of smell': {'COVID-19': 2},
        'loss of taste': {'COVID-19': 2},
    }

    scores = {d: 0 for d in disease_list}
    any_rule = False
    for sym in normalized:
        if sym in rule_weights:
            any_rule = True
            for dis, w in rule_weights[sym].items():
                scores[dis] = scores.get(dis, 0) + w

    # Build feature vector once
    input_vec = _to_feature_vector(set(normalized))

    # Model probabilities
    proba = model.predict_proba(input_vec)[0]
    model_ranking = sorted(
        [
            (disease_list[i], float(proba[i]))
            for i in range(len(disease_list))
        ],
        key=lambda x: x[1],
        reverse=True
    )

    if any_rule:
        # Pick highest rule score; if tie, fall back to model ranking
        max_score = max(scores.values())
        top_rule = [d for d, v in scores.items() if v == max_score and v > 0]
        if top_rule:
            # If multiple, use model ranking to break tie
            top_rule = sorted(top_rule, key=lambda d: next((p for name, p in model_ranking if name == d), 0), reverse=True)
            primary = top_rule[0]
        else:
            primary = model_ranking[0][0]
    else:
        primary = model_ranking[0][0]

    details = disease_details.get(primary, {})
    top3 = [
        {
            'disease': name,
            'probability': round(prob, 4),
            'description': disease_details.get(name, {}).get('description', ''),
            'medications': disease_details.get(name, {}).get('medications', []),
            'remedies': disease_details.get(name, {}).get('remedies', []),
        }
        for name, prob in model_ranking[:3]
    ]

    ai_summary = _gemini_summary(primary, set(normalized), details)

    return {
        'disease': primary,
        'description': details.get('description', ''),
        'medications': details.get('medications', []),
        'remedies': details.get('remedies', []),
        'ai_summary': ai_summary,
        'candidates': top3,
    }
