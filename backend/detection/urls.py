from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.DiseasePredictView.as_view(), name='disease-predict'),
    path('signup/', views.SignupView.as_view(), name='api-signup'),
    path('doctor/', views.DoctorPredictView.as_view(), name='doctor-predict'),
]
