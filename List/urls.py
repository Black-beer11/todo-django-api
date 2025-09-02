from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Création du router pour l'API
router = DefaultRouter()
router.register(r'tasks', views.TaskViewSet, basename='task')

app_name = 'list'

urlpatterns = [
    path('', views.home, name='home'),  # Page principale
    path('api/', include(router.urls)),  # Routes API
]
