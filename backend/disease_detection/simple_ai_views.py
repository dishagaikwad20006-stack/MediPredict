from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from medipredict.simple_ai import predict_disease

@api_view(['POST'])
def simple_predict(request):
    data = request.data
    symptoms = data.get('symptoms') or []
    if isinstance(symptoms, str):
        symptoms = [s.strip() for s in symptoms.split(',') if s.strip()]
    symptoms = [s.lower().strip() for s in symptoms]
    if not symptoms:
        return Response({'error': 'No symptoms provided.'}, status=status.HTTP_400_BAD_REQUEST)
    result = predict_disease(symptoms)
    return Response({'prediction': result})
