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

# Simple mappings for demo purposes
SYMPTOM_DISEASE_MAP = {
	'fever': 'Flu',
	'cough': 'Common Cold',
	'headache': 'Migraine',
	'chest pain': 'Heart Disease',
	'rash': 'Allergy',
}

DISEASE_MEDICATION_MAP = {
	'Flu': ['Paracetamol', 'Rest', 'Fluids'],
	'Common Cold': ['Antihistamines', 'Decongestants'],
	'Migraine': ['Ibuprofen', 'Rest in dark room'],
	'Heart Disease': ['Aspirin', 'Consult Cardiologist'],
	'Allergy': ['Antihistamines', 'Avoid allergen'],
	'Unknown': ['Consult a doctor'],
}

DISEASE_REMEDY_MAP = {
	'Flu': ['Drink warm fluids', 'Rest', 'Use humidifier'],
	'Common Cold': ['Stay hydrated', 'Steam inhalation'],
	'Migraine': ['Cold compress', 'Rest', 'Avoid triggers'],
	'Heart Disease': ['Healthy diet', 'Regular exercise', 'Avoid stress'],
	'Allergy': ['Avoid allergens', 'Use air purifier'],
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
