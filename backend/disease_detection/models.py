from django.db import models


class Disease(models.Model):
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    # store symptoms, medications and remedies as comma-separated lists for this demo
    symptoms = models.TextField(help_text='Comma separated symptoms', blank=True)
    medications = models.TextField(help_text='Comma separated medications', blank=True)
    remedies = models.TextField(help_text='Comma separated remedies', blank=True)

    def symptom_list(self):
        return [s.strip().lower() for s in self.symptoms.split(',') if s.strip()]

    def medications_list(self):
        return [s.strip() for s in self.medications.split(',') if s.strip()]

    def remedies_list(self):
        return [s.strip() for s in self.remedies.split(',') if s.strip()]

    def __str__(self):
        return self.name
