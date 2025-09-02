from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from .models import Task
from .serializers import TaskSerializer

def home(request):
    """Vue pour afficher la page principale de l'application ToDo"""
    return render(request, 'index.html')

class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les opérations CRUD sur les tâches
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    
    def list(self, request):
        """Liste toutes les tâches"""
        tasks = self.get_queryset()
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        """Crée une nouvelle tâche"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        """Récupère une tâche spécifique"""
        try:
            task = self.get_object()
            serializer = self.get_serializer(task)
            return Response(serializer.data)
        except Task.DoesNotExist:
            return Response({'error': 'Tâche non trouvée'}, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, pk=None):
        """Met à jour une tâche"""
        try:
            task = self.get_object()
            serializer = self.get_serializer(task, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Task.DoesNotExist:
            return Response({'error': 'Tâche non trouvée'}, status=status.HTTP_404_NOT_FOUND)
    
    def destroy(self, request, pk=None):
        """Supprime une tâche"""
        try:
            task = self.get_object()
            task.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Task.DoesNotExist:
            return Response({'error': 'Tâche non trouvée'}, status=status.HTTP_404_NOT_FOUND)
