// Configuration de l'API
const API_BASE_URL = '/api/tasks/';

// Éléments DOM
const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const loadingSpinner = document.getElementById('loadingSpinner');
const emptyState = document.getElementById('emptyState');
const notificationToast = document.getElementById('notificationToast');
const toastMessage = document.getElementById('toastMessage');

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    setupEventListeners();
});

// Configuration des écouteurs d'événements
function setupEventListeners() {
    taskForm.addEventListener('submit', handleTaskSubmit);
}

// Gestion de la soumission du formulaire
async function handleTaskSubmit(e) {
    e.preventDefault();
    
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    
    if (!title) {
        showNotification('Le titre de la tâche est requis', 'error');
        return;
    }
    
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
                completed: false
            })
        });
        
        if (response.ok) {
            const newTask = await response.json();
            showNotification('Tâche ajoutée avec succès !', 'success');
            taskForm.reset();
            
            // Ajouter la nouvelle tâche directement à la liste sans recharger
            addTaskToList(newTask);
            
        } else {
            const errorData = await response.json();
            showNotification(`Erreur: ${errorData.error || 'Impossible d\'ajouter la tâche'}`, 'error');
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la tâche:', error);
        showNotification('Erreur de connexion au serveur', 'error');
    }
}

// Ajouter une tâche directement à la liste
function addTaskToList(task) {
    // Masquer l'état vide s'il est affiché
    showEmptyState(false);
    
    // Créer le HTML pour la nouvelle tâche
    const taskHTML = createTaskHTML(task);
    
    // Ajouter la tâche au début de la liste
    if (taskList.children.length === 0) {
        taskList.innerHTML = taskHTML;
    } else {
        taskList.insertAdjacentHTML('afterbegin', taskHTML);
    }
    
    // Mettre à jour le compteur
    updateTaskCount();
}

// Chargement des tâches
async function loadTasks() {
    showLoading(true);
    
    try {
        const response = await fetch(API_BASE_URL);
        
        if (response.ok) {
            const tasks = await response.json();
            displayTasks(tasks);
        } else {
            showNotification('Erreur lors du chargement des tâches', 'error');
        }
    } catch (error) {
        console.error('Erreur lors du chargement des tâches:', error);
        showNotification('Erreur de connexion au serveur', 'error');
    } finally {
        showLoading(false);
    }
}

// Affichage des tâches
function displayTasks(tasks) {
    if (tasks.length === 0) {
        showEmptyState(true);
        return;
    }
    
    showEmptyState(false);
    taskCount.textContent = tasks.length;
    
    taskList.innerHTML = tasks.map(task => createTaskHTML(task)).join('');
}

// Création du HTML pour une tâche
function createTaskHTML(task) {
    const completedClass = task.completed ? 'task-completed' : '';
    const completedIcon = task.completed ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted';
    
    return `
        <div class="task-item card mb-3 ${completedClass}" data-task-id="${task.id}">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-1 text-center">
                        <button class="btn btn-check btn-outline-success" 
                                onclick="toggleTaskStatus(${task.id}, ${!task.completed})"
                                title="${task.completed ? 'Marquer comme non terminée' : 'Marquer comme terminée'}">
                            <i class="bi ${completedIcon}"></i>
                        </button>
                    </div>
                    <div class="col-md-8">
                        <h5 class="card-title mb-1">${escapeHtml(task.title)}</h5>
                        ${task.description ? `<p class="card-text text-muted mb-0">${escapeHtml(task.description)}</p>` : ''}
                        <small class="text-muted">
                            <i class="bi bi-clock me-1"></i>
                            Créée le ${formatDate(task.created_at)}
                            ${task.updated_at !== task.created_at ? ` • Modifiée le ${formatDate(task.updated_at)}` : ''}
                        </small>
                    </div>
                    <div class="col-md-3 text-end">
                        <button class="btn btn-delete btn-outline-danger me-2" 
                                onclick="deleteTask(${task.id})"
                                title="Supprimer la tâche">
                            <i class="bi bi-trash"></i>
                        </button>
                        <button class="btn btn-outline-primary btn-sm" 
                                onclick="editTask(${task.id})"
                                title="Modifier la tâche">
                            <i class="bi bi-pencil"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Basculer le statut d'une tâche
async function toggleTaskStatus(taskId, completed) {
    try {
        const response = await fetch(`${API_BASE_URL}${taskId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: completed })
        });
        
        if (response.ok) {
            showNotification(
                completed ? 'Tâche marquée comme terminée !' : 'Tâche marquée comme non terminée !', 
                'success'
            );
            
            // Mettre à jour l'interface en temps réel
            updateTaskStatus(taskId, completed);
            
        } else {
            showNotification('Erreur lors de la modification du statut', 'error');
        }
    } catch (error) {
        console.error('Erreur lors de la modification du statut:', error);
        showNotification('Erreur de connexion au serveur', 'error');
    }
}

// Mettre à jour le statut d'une tâche en temps réel
function updateTaskStatus(taskId, completed) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
        const taskItem = taskElement;
        const checkButton = taskItem.querySelector('.btn-check i');
        
        if (completed) {
            taskItem.classList.add('task-completed');
            checkButton.className = 'bi bi-check-circle-fill text-success';
            checkButton.parentElement.title = 'Marquer comme non terminée';
        } else {
            taskItem.classList.remove('task-completed');
            checkButton.className = 'bi bi-circle text-muted';
            checkButton.parentElement.title = 'Marquer comme terminée';
        }
    }
}

// Supprimer une tâche
async function deleteTask(taskId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${taskId}/`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Tâche supprimée avec succès !', 'success');
            
            // Supprimer la tâche de l'interface en temps réel
            removeTaskFromList(taskId);
            
        } else {
            showNotification('Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showNotification('Erreur de connexion au serveur', 'error');
    }
}

// Supprimer une tâche de la liste en temps réel
function removeTaskFromList(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
        taskElement.remove();
        
        // Mettre à jour le compteur
        updateTaskCount();
        
        // Vérifier s'il faut afficher l'état vide
        const remainingTasks = taskList.querySelectorAll('.task-item');
        if (remainingTasks.length === 0) {
            showEmptyState(true);
        }
    }
}

// Modifier une tâche (version simple avec prompt)
function editTask(taskId) {
    const newTitle = prompt('Nouveau titre de la tâche:');
    if (newTitle && newTitle.trim()) {
        updateTask(taskId, newTitle.trim());
    }
}

// Mettre à jour une tâche
async function updateTask(taskId, newTitle) {
    try {
        const response = await fetch(`${API_BASE_URL}${taskId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: newTitle })
        });
        
        if (response.ok) {
            showNotification('Tâche modifiée avec succès !', 'success');
            
            // Mettre à jour le titre en temps réel
            updateTaskTitle(taskId, newTitle);
            
        } else {
            showNotification('Erreur lors de la modification', 'error');
        }
    } catch (error) {
        console.error('Erreur lors de la modification:', error);
        showNotification('Erreur de connexion au serveur', 'error');
    }
}

// Mettre à jour le titre d'une tâche en temps réel
function updateTaskTitle(taskId, newTitle) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
        const titleElement = taskElement.querySelector('.card-title');
        if (titleElement) {
            titleElement.textContent = newTitle;
        }
    }
}

// Mettre à jour le compteur de tâches
function updateTaskCount() {
    const currentTasks = taskList.querySelectorAll('.task-item');
    taskCount.textContent = currentTasks.length;
}

// Afficher/masquer l'état de chargement
function showLoading(show) {
    if (show) {
        loadingSpinner.classList.remove('d-none');
        taskList.classList.add('d-none');
    } else {
        loadingSpinner.classList.add('d-none');
        taskList.classList.remove('d-none');
    }
}

// Afficher/masquer l'état vide
function showEmptyState(show) {
    if (show) {
        emptyState.classList.remove('d-none');
        taskList.classList.add('d-none');
        taskCount.textContent = '0';
    } else {
        emptyState.classList.add('d-none');
        taskList.classList.remove('d-none');
    }
}

// Afficher une notification
function showNotification(message, type = 'info') {
    toastMessage.textContent = message;
    
    // Ajouter des classes CSS selon le type
    const toast = notificationToast.querySelector('.toast');
    toast.className = `toast ${type === 'error' ? 'border-danger' : type === 'success' ? 'border-success' : 'border-primary'}`;
    
    // Afficher le toast
    const bsToast = new bootstrap.Toast(notificationToast);
    bsToast.show();
}

// Échapper le HTML pour éviter les injections XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Formater une date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
