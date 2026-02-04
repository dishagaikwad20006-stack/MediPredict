
from django.urls import path
from . import views
from .simple_ai_views import simple_predict

urlpatterns = [
    path('diseases/', views.list_diseases, name='list_diseases'),
    path('predict/', views.predict, name='predict'),
    path('simple_predict/', simple_predict, name='simple_predict'),
]
