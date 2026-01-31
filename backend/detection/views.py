from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny
# User registration API
class SignupView(generics.CreateAPIView):
	queryset = User.objects.all()
	permission_classes = (AllowAny,)
	def post(self, request, *args, **kwargs):
		username = request.data.get('username')
		password = request.data.get('password')
		if not username or not password:
			return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
		if User.objects.filter(username=username).exists():
			return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
		user = User.objects.create_user(username=username, password=password)
		return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Example: simple rule-based logic for demo


# --- AI-GENERATED LARGE MEDICAL DATASETS (500+ entries) ---
# For brevity, only a sample is shown here. In your real app, this would be a much larger dataset.
SYMPTOM_DISEASE_MAP = {
	'fever': 'Influenza',
	'cough': 'Bronchitis',
	'headache': 'Migraine',
	'chest pain': 'Angina',
	'rash': 'Measles',
	'joint pain': 'Rheumatoid Arthritis',
	'abdominal pain': 'Gastritis',
	'nausea': 'Gastroenteritis',
	'vomiting': 'Food Poisoning',
	'diarrhea': 'Cholera',
	'shortness of breath': 'Asthma',
	'fatigue': 'Anemia',
	'weight loss': 'Diabetes',
	'night sweats': 'Tuberculosis',
	'blurred vision': 'Glaucoma',
	'dizziness': 'Vertigo',
	'palpitations': 'Arrhythmia',
	'swelling': 'Nephrotic Syndrome',
	'itching': 'Eczema',
	'hair loss': 'Alopecia',
	'sore throat': 'Pharyngitis',
	'runny nose': 'Allergic Rhinitis',
	'ear pain': 'Otitis Media',
	'back pain': 'Sciatica',
	'muscle pain': 'Fibromyalgia',
	'confusion': 'Delirium',
	'memory loss': 'Alzheimer’s Disease',
	'tremor': 'Parkinson’s Disease',
	'seizure': 'Epilepsy',
	'yellow skin': 'Hepatitis',
	'blood in urine': 'Urinary Tract Infection',
	'frequent urination': 'Diabetes Mellitus',
	'painful urination': 'Cystitis',
	'leg swelling': 'Deep Vein Thrombosis',
	'chills': 'Malaria',
	'night cough': 'Whooping Cough',
	'difficulty swallowing': 'Esophagitis',
	'hoarseness': 'Laryngitis',
	'red eyes': 'Conjunctivitis',
	'double vision': 'Multiple Sclerosis',
	'drooping eyelid': 'Myasthenia Gravis',
	'loss of smell': 'COVID-19',
	'loss of taste': 'COVID-19',
	'skin ulcers': 'Leprosy',
	'joint swelling': 'Gout',
	'muscle weakness': 'Polymyositis',
	'tingling': 'Peripheral Neuropathy',
	'numbness': 'Stroke',
	'anxiety': 'Generalized Anxiety Disorder',
	'depression': 'Major Depressive Disorder',
	'insomnia': 'Sleep Apnea',
	'snoring': 'Obstructive Sleep Apnea',
	# ... (add 450+ more entries for a real dataset)
}

DISEASE_MEDICATION_MAP = {
	'Influenza': ['Oseltamivir', 'Paracetamol', 'Rest', 'Fluids'],
	'Bronchitis': ['Amoxicillin', 'Cough Syrup', 'Rest'],
	'Migraine': ['Sumatriptan', 'Ibuprofen', 'Rest in dark room'],
	'Angina': ['Nitroglycerin', 'Aspirin', 'Beta Blockers'],
	'Measles': ['Vitamin A', 'Fever reducers', 'Hydration'],
	'Rheumatoid Arthritis': ['Methotrexate', 'NSAIDs', 'Steroids'],
	'Gastritis': ['Omeprazole', 'Antacids', 'Diet change'],
	'Gastroenteritis': ['ORS', 'Loperamide', 'Rest'],
	'Food Poisoning': ['ORS', 'Antiemetics', 'Rest'],
	'Cholera': ['ORS', 'Doxycycline', 'Zinc'],
	'Asthma': ['Salbutamol Inhaler', 'Steroids'],
	'Anemia': ['Iron supplements', 'Folic acid'],
	'Diabetes': ['Metformin', 'Insulin'],
	'Tuberculosis': ['Isoniazid', 'Rifampicin', 'Ethambutol'],
	'Glaucoma': ['Timolol', 'Latanoprost'],
	'Vertigo': ['Betahistine', 'Meclizine'],
	'Arrhythmia': ['Amiodarone', 'Beta Blockers'],
	'Nephrotic Syndrome': ['Prednisone', 'ACE inhibitors'],
	'Eczema': ['Hydrocortisone cream', 'Moisturizers'],
	'Alopecia': ['Minoxidil', 'Finasteride'],
	'Pharyngitis': ['Penicillin', 'Lozenges'],
	'Allergic Rhinitis': ['Loratadine', 'Nasal Spray'],
	'Otitis Media': ['Amoxicillin', 'Pain relievers'],
	'Sciatica': ['NSAIDs', 'Physical therapy'],
	'Fibromyalgia': ['Pregabalin', 'Amitriptyline'],
	'Delirium': ['Haloperidol', 'Treat underlying cause'],
	'Alzheimer’s Disease': ['Donepezil', 'Memantine'],
	'Parkinson’s Disease': ['Levodopa', 'Carbidopa'],
	'Epilepsy': ['Valproate', 'Carbamazepine'],
	'Hepatitis': ['Interferon', 'Antivirals'],
	'Urinary Tract Infection': ['Nitrofurantoin', 'Ciprofloxacin'],
	'Diabetes Mellitus': ['Metformin', 'Insulin'],
	'Cystitis': ['Nitrofurantoin', 'Pain relievers'],
	'Deep Vein Thrombosis': ['Heparin', 'Warfarin'],
	'Malaria': ['Artemisinin', 'Chloroquine'],
	'Whooping Cough': ['Azithromycin', 'Cough suppressants'],
	'Esophagitis': ['Omeprazole', 'Diet change'],
	'Laryngitis': ['Voice rest', 'Steam inhalation'],
	'Conjunctivitis': ['Antibiotic drops', 'Lubricants'],
	'Multiple Sclerosis': ['Interferon beta', 'Steroids'],
	'Myasthenia Gravis': ['Pyridostigmine', 'Steroids'],
	'COVID-19': ['Paracetamol', 'Rest', 'Fluids'],
	'Leprosy': ['Dapsone', 'Rifampicin'],
	'Gout': ['Allopurinol', 'Colchicine'],
	'Polymyositis': ['Prednisone', 'Immunosuppressants'],
	'Peripheral Neuropathy': ['Gabapentin', 'Pain relievers'],
	'Stroke': ['Aspirin', 'Thrombolytics'],
	'Generalized Anxiety Disorder': ['SSRIs', 'Cognitive therapy'],
	'Major Depressive Disorder': ['SSRIs', 'Therapy'],
	'Sleep Apnea': ['CPAP', 'Weight loss'],
	'Obstructive Sleep Apnea': ['CPAP', 'Surgery'],
	# ... (add 450+ more entries for a real dataset)
	'Unknown': ['Consult a doctor'],
}

DISEASE_REMEDY_MAP = {
	'Influenza': ['Drink warm fluids', 'Rest', 'Use humidifier'],
	'Bronchitis': ['Steam inhalation', 'Hydration'],
	'Migraine': ['Cold compress', 'Rest', 'Avoid triggers'],
	'Angina': ['Rest', 'Avoid exertion'],
	'Measles': ['Hydration', 'Rest', 'Vitamin A'],
	'Rheumatoid Arthritis': ['Warm compress', 'Exercise', 'Physical therapy'],
	'Gastritis': ['Eat small meals', 'Avoid spicy food'],
	'Gastroenteritis': ['Hydration', 'Bland diet'],
	'Food Poisoning': ['Hydration', 'Rest'],
	'Cholera': ['ORS', 'Zinc supplements'],
	'Asthma': ['Avoid triggers', 'Breathing exercises'],
	'Anemia': ['Iron-rich foods', 'Vitamin C'],
	'Diabetes': ['Diet control', 'Exercise'],
	'Tuberculosis': ['Good nutrition', 'Rest'],
	'Glaucoma': ['Eye drops as prescribed'],
	'Vertigo': ['Balance exercises', 'Hydration'],
	'Arrhythmia': ['Avoid caffeine', 'Regular checkups'],
	'Nephrotic Syndrome': ['Low salt diet', 'Monitor weight'],
	'Eczema': ['Moisturize skin', 'Avoid irritants'],
	'Alopecia': ['Gentle hair care', 'Reduce stress'],
	'Pharyngitis': ['Warm salt water gargle', 'Rest'],
	'Allergic Rhinitis': ['Avoid allergens', 'Use air purifier'],
	'Otitis Media': ['Warm compress', 'Pain relief'],
	'Sciatica': ['Stretching', 'Physical therapy'],
	'Fibromyalgia': ['Gentle exercise', 'Stress management'],
	'Delirium': ['Treat underlying cause', 'Calm environment'],
	'Alzheimer’s Disease': ['Mental exercises', 'Routine'],
	'Parkinson’s Disease': ['Physical therapy', 'Exercise'],
	'Epilepsy': ['Medication adherence', 'Avoid triggers'],
	'Hepatitis': ['Avoid alcohol', 'Rest'],
	'Urinary Tract Infection': ['Hydration', 'Hygiene'],
	'Diabetes Mellitus': ['Monitor blood sugar', 'Healthy diet'],
	'Cystitis': ['Hydration', 'Avoid irritants'],
	'Deep Vein Thrombosis': ['Leg elevation', 'Compression stockings'],
	'Malaria': ['Mosquito nets', 'Hydration'],
	'Whooping Cough': ['Rest', 'Hydration'],
	'Esophagitis': ['Eat slowly', 'Avoid spicy foods'],
	'Laryngitis': ['Voice rest', 'Steam inhalation'],
	'Conjunctivitis': ['Cold compress', 'Avoid touching eyes'],
	'Multiple Sclerosis': ['Physical therapy', 'Rest'],
	'Myasthenia Gravis': ['Rest', 'Balanced diet'],
	'COVID-19': ['Isolation', 'Hydration', 'Rest'],
	'Leprosy': ['Wound care', 'Hygiene'],
	'Gout': ['Avoid red meat', 'Hydration'],
	'Polymyositis': ['Physical therapy', 'Rest'],
	'Peripheral Neuropathy': ['Foot care', 'Pain management'],
	'Stroke': ['Rehabilitation', 'Physical therapy'],
	'Generalized Anxiety Disorder': ['Relaxation techniques', 'Therapy'],
	'Major Depressive Disorder': ['Therapy', 'Exercise'],
	'Sleep Apnea': ['Weight loss', 'Sleep on side'],
	'Obstructive Sleep Apnea': ['CPAP', 'Avoid alcohol'],
	# ... (add 450+ more entries for a real dataset)
	'Unknown': ['Seek professional advice'],
}


class DiseasePredictView(APIView):
	def post(self, request):
		symptoms = request.data.get('symptoms', [])
		if not isinstance(symptoms, list):
			return Response({'error': 'symptoms must be a list'}, status=status.HTTP_400_BAD_REQUEST)
		# Simple logic: return the first matching disease
		for symptom in symptoms:
			disease = SYMPTOM_DISEASE_MAP.get(symptom.lower())
			if disease:
				return Response({'disease': disease})
		return Response({'disease': 'Unknown'}, status=status.HTTP_200_OK)


# New DoctorPredictView
class DoctorPredictView(APIView):
	def post(self, request):
		symptoms = request.data.get('symptoms', [])
		if not isinstance(symptoms, list):
			return Response({'error': 'symptoms must be a list'}, status=status.HTTP_400_BAD_REQUEST)
		# Find disease
		found_disease = 'Unknown'
		for symptom in symptoms:
			disease = SYMPTOM_DISEASE_MAP.get(symptom.lower())
			if disease:
				found_disease = disease
				break
		# Get meds and remedies
		medications = DISEASE_MEDICATION_MAP.get(found_disease, ['Consult a doctor'])
		remedies = DISEASE_REMEDY_MAP.get(found_disease, ['Seek professional advice'])
		return Response({
			'disease': found_disease,
			'medications': medications,
			'remedies': remedies
		}, status=status.HTTP_200_OK)
