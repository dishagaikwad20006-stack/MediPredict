from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Disease
from .serializers import DiseaseSerializer


@api_view(['GET'])
def list_diseases(request):
    qs = Disease.objects.all()
    serializer = DiseaseSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def predict(request):
    # Expect JSON: {"symptoms": ["fever", "cough"]}
    data = request.data
    symptoms = data.get('symptoms') or []
    if isinstance(symptoms, str):
        symptoms = [s.strip() for s in symptoms.split(',') if s.strip()]
    symptoms = [s.lower().strip() for s in symptoms]

    if not symptoms:
        return Response({'error': 'No symptoms provided.'}, status=status.HTTP_400_BAD_REQUEST)

    # Simple rule-based matching: score diseases by matched symptoms
    results = []
    for disease in Disease.objects.all():
        ds = disease.symptom_list()
        matched = len([s for s in symptoms if s in ds])
        if matched:
            results.append({
                'disease': disease.name,
                'description': disease.description,
                'match_count': matched,
                'symptom_list': ds,
                'symptom_count': len(ds),
                'medications': disease.medications_list(),
                'remedies': disease.remedies_list(),
            })

    # sort by match_count descending
    results.sort(key=lambda x: x['match_count'], reverse=True)

    if not results:
        return Response({'error': 'No matching disease found.'}, status=status.HTTP_200_OK)

    return Response({'predictions': results})
