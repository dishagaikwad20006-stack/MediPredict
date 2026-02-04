from rest_framework import serializers
from .models import Disease


class DiseaseSerializer(serializers.ModelSerializer):
    symptom_list = serializers.SerializerMethodField()
    medications_list = serializers.SerializerMethodField()
    remedies_list = serializers.SerializerMethodField()

    class Meta:
        model = Disease
        fields = ['id', 'name', 'description', 'symptoms', 'symptom_list', 'medications', 'medications_list', 'remedies', 'remedies_list']

    def get_symptom_list(self, obj):
        return obj.symptom_list()

    def get_medications_list(self, obj):
        return obj.medications_list()

    def get_remedies_list(self, obj):
        return obj.remedies_list()
