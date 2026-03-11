# 📋 Installation & Test - MediStock AI

Guide complet pour installer, lancer et tester le projet MediStock AI localement.

---

## 🔧 Prérequis

- **Node.js** >= 24.0 (télécharger depuis [nodejs.org](https://nodejs.org))
- **npm** >= 11.0 (inclus avec Node.js)
- **Git** (optionnel, pour cloner le repo)
- **Navigateur moderne** (Chrome, Firefox, Edge, Safari)

### Vérifier votre installation :
```powershell
node --version    # Doit afficher v24+
npm --version     # Doit afficher 11+
```

---

## 📦 Installation - Étape 1: Dépendances

### Backend :
```powershell
cd backend
npm install
```

### Frontend :
```powershell
cd ../frontend
npm install
```

### Vérification :
```powershell
# Depuis le répertoire racine (PHARMACIE/)
ls backend/node_modules   # Doit exister
ls frontend/node_modules  # Doit exister
```

---

## ▶️ Lancement du Projet

### Option A : Lancer les deux serveurs (Recommandé)

**Terminal 1 - Backend (port 4000) :**
```powershell
cd backend
npm run dev
```

Vous devez voir :
```
✓ Built in 1.2s
👂 Backend listening on port 4000
Database initialized with seed data
```

**Terminal 2 - Frontend (port 5173) :**
```powershell
cd frontend
npm run dev -- --host 127.0.0.1
```

Vous devez voir :
```
VITE v7.3.1  ready in 1.6 ms

➜  Local:     http://127.0.0.1:5173/
```

### Option B : Accéder à l'application

Ouvrez votre navigateur : **http://127.0.0.1:5173**

Vous verrez :
- 📊 Dashboard (stats, alertes, mouvements)
- 📦 Inventaire (4 médicaments avec filtres)
- 👥 Profils (4 membres de la famille)
- 📜 Historique (4 mouvements)
- 💬 Assistant (chat simulé)

---

## 🧪 Test des Endpoints API

### Vérifier la santé du backend :
```powershell
Invoke-WebRequest http://localhost:4000/api/health | Select-Object -ExpandProperty Content
```

Réponse attendue :
```json
{"status":"ok","service":"medistock-api"}
```

### Tester les 6 endpoints principaux :

#### 1. Dashboard (statistiques)
```powershell
curl http://localhost:4000/api/dashboard
```
Retourne : stats (4 médicaments, 2 expirant, 1 en rupture), alertes, mouvements récents

#### 2. Inventaire (médicaments)
```powershell
curl http://localhost:4000/api/inventory?search=&status=ok
```
Retourne : liste des médicaments avec filtres

#### 3. Profils (famille)
```powershell
curl http://localhost:4000/api/profiles
```
Retourne : Danil, Slim, Mamie Jeanne, Claire

#### 4. Historique (mouvements)
```powershell
curl http://localhost:4000/api/history
```
Retourne : 4 entrées d'historique (dates, types, quantités)

#### 5. Chat (Assistant IA simulé)
```powershell
curl -X POST http://localhost:4000/api/chat `
  -H "Content-Type: application/json" `
  -d '{"message":"Quels médicaments sont expirés?"}'
```
Retourne : réponse simulée + disclaimer

#### 6. Profils détaillés
```powershell
curl http://localhost:4000/api/profiles
```

---

## ✅ Checklist de Test Complet

- [ ] Backend démarre sans erreur  
- [ ] Frontend chargé sur http://127.0.0.1:5173  
- [ ] `/api/health` retourne `{"status":"ok"}`  
- [ ] Dashboard affiche 4 médicaments + alertes  
- [ ] Inventaire affiche les 4 médicaments filtrables  
- [ ] Profils affiche les 4 membres de la famille  
- [ ] Historique affiche 4 mouvements  
- [ ] Chat répond aux messages  

---

## 🗄️ Base de Données

**Localisation :** `backend/data/medistock.db` (SQLite local)

**Schéma :**
- `profiles` - 4 entrées (Danil, Slim, Mamie Jeanne, Claire)
- `medicines` - 4 entrées (Metformine, Amoxicilline, Levothyroxine, Ibuprofène)
- `stock_items` - 4 entrées (stock et dates d'expiration)
- `movements` - 4 entrées (historique des mouvements)

**Réinitialiser la DB :**
```powershell
# Supprimer le fichier DB (will be recreated on next backend start)
rm backend/data/medistock.db
# Relancer le backend
```

---

## 🐛 Troubleshooting

### ❌ Erreur : "Port 4000 déjà utilisé"
```powershell
# Trouver le processus qui utilise le port 4000
Get-Process | Where-Object { $_.Handles -like "*4000*" }

# Ou tuer directement
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### ❌ Erreur : "Cannot find module"
```powershell
# Réinstaller les dépendances
rm -r backend/node_modules
npm install --prefix backend

rm -r frontend/node_modules
npm install --prefix frontend
```

### ❌ Frontend ne charge pas
```powershell
# Vérifier que le backend est accessible
curl http://localhost:4000/api/health

# Si pas accessible, relancer le backend
npm run dev --prefix backend
```

### ❌ Erreur SQLite "database is locked"
```powershell
# Attendre 2-3 secondes ou relancer le backend
# C'est normal au démarrage (initialisation du schéma)
```

---

## 📝 Architecture Locale

```
PHARMACIE/
├── frontend/                    # React 19 + Vite
│   ├── src/
│   │   ├── App.tsx             # Pages & routing
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Design system
│   └── package.json            # Scripts: dev, build
│
├── backend/                     # Node.js + Express
│   ├── src/
│   │   ├── server.ts           # API REST (6 endpoints)
│   │   └── db.ts               # SQLite + seed data
│   ├── data/
│   │   └── medistock.db        # Base de données SQLite
│   └── package.json            # Scripts: dev, build, start
│
└── SETUP.md                     # Ce fichier
```

---

## 🚀 Prochaines Étapes

1. **Connecter Frontend → Backend** (remplacer mock data)
2. **Ajouter CRUD endpoints** (POST/PUT/DELETE)
3. **Intégration Ollama** (Chat IA local en Sprint 3)

---

## 💬 Support

En cas de problème :
1. Vérifier les logs terminal (erreurs TypeScript, port en conflit)
2. Vérifier que Node.js >= 24.0
3. Réinstaller les dépendances (`npm install`)
4. Relancer les serveurs

---

**Dernière mise à jour :** 11 mars 2026  
**Version :** 1.0 du projet MediStock AI
