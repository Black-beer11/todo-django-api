# 📝 ToDo App - Gestionnaire de Tâches

Une application web moderne et dynamique de gestion de tâches construite avec **Django** et **Django REST Framework** pour le backend, et **HTML/CSS/JavaScript** avec **Bootstrap** pour le frontend.

## ✨ Fonctionnalités

### 🔧 **Backend (Django + DRF)**
- **API REST complète** avec tous les endpoints CRUD
- **Modèle Task** avec champs : titre, description, statut, dates
- **Sérialisation JSON** automatique des données
- **Gestion des erreurs** et codes de statut HTTP appropriés
- **Architecture MVC** propre et maintenable

### 🎨 **Frontend (HTML + CSS + JavaScript)**
- **Interface moderne** avec Bootstrap 5 et icônes
- **Design responsive** pour tous les appareils
- **Animations fluides** et transitions CSS
- **Thème sombre** élégant et professionnel

### 🚀 **Fonctionnalités Utilisateur**
- ✅ **Ajouter** une nouvelle tâche avec titre et description
- 📋 **Afficher** toutes les tâches en temps réel
- ✅ **Cocher/Décocher** le statut "terminée"
- ✏️ **Modifier** le titre d'une tâche existante
- 🗑️ **Supprimer** une tâche avec confirmation
- 🔢 **Compteur** de tâches en temps réel
- 📱 **Interface responsive** pour mobile et desktop

### ⚡ **Performance et UX**
- **Mises à jour en temps réel** sans rechargement de page
- **Notifications toast** pour le feedback utilisateur
- **Gestion des états** : chargement, vide, erreur
- **Validation côté client** des formulaires
- **Sécurité** : protection contre les injections XSS

## 🏗️ Architecture Technique

### **Structure du Projet**
```
ToDo/
├── List/                    # Application Django
│   ├── models.py           # Modèle Task
│   ├── serializers.py      # Sérialiseur DRF
│   ├── views.py            # Vues API + page principale
│   ├── urls.py             # Routes de l'application
│   └── admin.py            # Interface d'administration
├── ToDo/                    # Configuration du projet
│   ├── settings.py         # Paramètres Django
│   ├── urls.py             # Routes principales
│   └── wsgi.py             # Configuration WSGI
├── templates/               # Templates HTML
│   └── index.html          # Page principale
├── static/                  # Fichiers statiques
│   └── js/
│       └── app.js          # Logique JavaScript
├── manage.py                # Gestionnaire Django
└── README.md                # Ce fichier
```

### **Technologies Utilisées**
- **Backend** : Django 5.0, Django REST Framework
- **Frontend** : HTML5, CSS3, JavaScript ES6+
- **UI Framework** : Bootstrap 5.3.0
- **Icônes** : Bootstrap Icons 1.10.0
- **Base de données** : SQLite (développement)

## 🚀 Installation et Démarrage

### **Prérequis**
- Python 3.8+
- pip (gestionnaire de paquets Python)
- Git (optionnel)

### **1. Cloner le Projet**
```bash
git clone https://github.com/Black-beer11/todo-django-api.git
cd ToDo
```

### **2. Créer un Environnement Virtuel**
```bash
python -m venv env
# Windows
env\Scripts\activate
# macOS/Linux
source env/bin/activate
```

### **3. Installer les Dépendances**
```bash
pip install django
pip install djangorestframework
```

### **4. Configurer la Base de Données**
```bash
python manage.py makemigrations
python manage.py migrate
```

### **5. Créer un Superuser (Optionnel)**
```bash
python manage.py createsuperuser
```

### **6. Lancer le Serveur**
```bash
python manage.py runserver
```

### **7. Accéder à l'Application**
- **Application principale** : http://localhost:8000/
- **API REST** : http://localhost:8000/api/
- **Admin Django** : http://localhost:8000/admin/

## 🔌 API REST

### **Endpoints Disponibles**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/tasks/` | Récupérer toutes les tâches |
| `POST` | `/api/tasks/` | Créer une nouvelle tâche |
| `GET` | `/api/tasks/<id>/` | Récupérer une tâche spécifique |
| `PUT` | `/api/tasks/<id>/` | Modifier une tâche |
| `DELETE` | `/api/tasks/<id>/` | Supprimer une tâche |

### **Format des Données**

#### **Création d'une Tâche (POST)**
```json
{
    "title": "Titre de la tâche",
    "description": "Description optionnelle",
    "completed": false
}
```

#### **Réponse d'une Tâche**
```json
{
    "id": 1,
    "title": "Titre de la tâche",
    "description": "Description optionnelle",
    "completed": false,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
}
```

## 🎯 Utilisation

### **Ajouter une Tâche**
1. Remplir le formulaire en haut de la page
2. Saisir le titre (obligatoire) et la description (optionnelle)
3. Cliquer sur "Ajouter la tâche"
4. La tâche apparaît instantanément dans la liste

### **Gérer les Tâches**
- **Cocher** : Cliquer sur le bouton rond vert pour marquer comme terminée
- **Modifier** : Cliquer sur l'icône crayon pour changer le titre
- **Supprimer** : Cliquer sur l'icône poubelle pour supprimer

### **Interface Responsive**
- **Desktop** : Affichage en colonnes avec tous les détails
- **Mobile** : Interface adaptée avec boutons optimisés
- **Tablette** : Layout intermédiaire pour une expérience optimale

## 🔧 Configuration

### **Variables d'Environnement**
```python
# settings.py
DEBUG = True  # Mettre à False en production
SECRET_KEY = 'votre-clé-secrète'
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
```

### **Base de Données**
```python
# Configuration SQLite (défaut)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Pour PostgreSQL ou MySQL, modifier ENGINE et paramètres
```

## 🚀 Déploiement

### **Production**
1. **Sécurité** : `DEBUG = False`
2. **Base de données** : PostgreSQL ou MySQL
3. **Serveur web** : Nginx + Gunicorn
4. **Variables d'environnement** : Utiliser un fichier .env
5. **Collecte statiques** : `python manage.py collectstatic`

### **Docker (Optionnel)**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

## 🧪 Tests

### **Lancer les Tests**
```bash
python manage.py test
```

### **Tests Disponibles**
- Tests des modèles
- Tests des vues API
- Tests des sérialiseurs
- Tests d'intégration

## 📱 Compatibilité

### **Navigateurs Supportés**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### **Appareils Supportés**
- ✅ Desktop (Windows, macOS, Linux)
- ✅ Mobile (iOS, Android)
- ✅ Tablettes (iPad, Android)

## 🔒 Sécurité

### **Mesures Implémentées**
- Protection CSRF Django
- Validation des données côté serveur
- Échappement HTML côté client
- Gestion sécurisée des erreurs
- Validation des entrées utilisateur

### **Bonnes Pratiques**
- Utilisation de HTTPS en production
- Validation des permissions utilisateur
- Logs de sécurité
- Mises à jour régulières des dépendances

## 🤝 Contribution

### **Comment Contribuer**
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### **Standards de Code**
- Suivre les conventions PEP 8 (Python)
- Commentaires en français
- Noms de variables explicites
- Tests pour les nouvelles fonctionnalités

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

### **Problèmes Courants**
- **Erreur de migration** : Supprimer `db.sqlite3` et relancer les migrations
- **Problème de statiques** : Vérifier `STATICFILES_DIRS` dans settings.py
- **Erreur d'API** : Vérifier que `rest_framework` est dans `INSTALLED_APPS`

### **Contact**
- **Issues** : Utiliser la section Issues GitHub
- **Discussions** : Section Discussions GitHub
- **Email** : [blackbeer319@gmail.com]

## 🎉 Remerciements

- **Django** pour le framework backend robuste
- **Django REST Framework** pour l'API REST
- **Bootstrap** pour l'interface utilisateur moderne
- **Bootstrap Icons** pour les icônes élégantes

---

**Développé avec ❤️ en utilisant Django et les technologies web modernes**

*Dernière mise à jour : Septembre 2025*
