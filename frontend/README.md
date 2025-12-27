# Blog Application - Full Stack with Docker

Modern blog application with Django REST Framework backend and React frontend, fully dockerized.

## 🚀 Tech Stack

**Backend:**
- Django 5.2 + Django REST Framework
- PostgreSQL 15
- JWT Authentication
- Docker + Docker Compose

**Frontend:**
- React 19 + Vite
- Tailwind CSS 4
- React Router
- Axios

## 📋 Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Make (optional, for shortcuts)

## 🎯 Quick Start

### Option 1: Using Make (Recommended)

```bash
# Production (Nginx + optimized build)
make init

# Development (Hot reload)
make dev-init
```

### Option 2: Manual Docker Compose

**Production:**
```bash
# Build and start
docker-compose build
docker-compose up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser
```

**Development with Hot Reload:**
```bash
# Build and start
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up

# In another terminal, run migrations
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate
```

## 🌐 Access Points

### Production Mode
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/blog/api/v1
- **Admin Panel:** http://localhost:8000/admin
- **SMTP Web UI:** http://localhost:5000

### Development Mode
- **Frontend (Hot Reload):** http://localhost:5173
- **Backend:** http://localhost:8000
- **Admin Panel:** http://localhost:8000/admin
- **SMTP Web UI:** http://localhost:5000

## 📁 Project Structure

```
.
├── core/                      # Django backend
│   ├── accounts/             # User management
│   ├── blog/                 # Blog app
│   ├── core/                 # Project settings
│   └── manage.py
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── context/          # React context
│   ├── Dockerfile            # Production build
│   ├── Dockerfile.dev        # Development with hot reload
│   └── nginx.conf            # Nginx config for production
├── docker-compose.yml         # Production setup
├── docker-compose.dev.yml     # Development setup
├── Dockerfile                 # Backend Dockerfile
└── Makefile                   # Helper commands
```

## 🛠️ Available Make Commands

```bash
# Production
make build          # Build production images
make up             # Start production containers
make down           # Stop all containers
make logs           # View logs
make restart        # Restart services

# Development
make dev-build      # Build development images
make dev-up         # Start dev with hot reload
make dev-down       # Stop development
make dev-logs       # View dev logs

# Database
make migrate        # Run migrations
make makemigrations # Create migrations
make createsuperuser # Create admin user
make dbshell        # Access database

# Testing
make test           # Run backend tests
make test-frontend  # Run frontend tests

# Utilities
make shell          # Django shell
make backend-shell  # Backend container bash
make frontend-shell # Frontend container bash

# Backup
make backup-db      # Backup database
make restore-db FILE=backup.sql  # Restore database

# Cleanup
make clean          # Remove everything
make clean-volumes  # Remove volumes only
```

## 🔧 Configuration

### Environment Variables

**Backend (.env in core/):**
```bash
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=blog_db
DB_USER=blog_user
DB_PASSWORD=blog_password
DB_HOST=db
DB_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
```

**Frontend (.env.local in frontend/):**
```bash
VITE_API_URL=http://localhost:8000/blog/api/v1
```

## 🐳 Docker Details

### Production Setup
- **Multi-stage build** for frontend (optimized size)
- **Nginx** serves static React build
- **Gunicorn** for Django (add later)
- **Health checks** for all services
- **Named volumes** for persistence

### Development Setup
- **Hot reload** for React (Vite dev server)
- **Auto-reload** for Django
- **Volume mounts** for live code changes
- **No build caching** for faster iterations

## 📊 Database Management

### Backup
```bash
make backup-db
# Creates: backup_YYYYMMDD_HHMMSS.sql
```

### Restore
```bash
make restore-db FILE=backup_20250101_120000.sql
```

### Reset Database
```bash
docker-compose down -v  # Removes volumes
docker-compose up -d    # Fresh start
make migrate            # Run migrations
```

## 🧪 Testing

### Backend Tests
```bash
make test

# Or directly
docker-compose exec backend pytest
```

### Frontend Tests
```bash
make test-frontend

# Or directly
docker-compose exec frontend npm test
```

## 🚀 Production Deployment

### Build Production Images
```bash
make prod-build
```

### Deploy
```bash
# Start services
make prod-up

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Production Checklist
- [ ] Set strong `SECRET_KEY`
- [ ] Set `DEBUG=False`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Use proper PostgreSQL credentials
- [ ] Setup SSL/TLS (add reverse proxy)
- [ ] Configure CORS properly
- [ ] Setup monitoring (Sentry, etc.)
- [ ] Configure backups
- [ ] Setup log rotation

## 🔒 Security Notes

1. **Change default passwords** in production
2. **Use environment variables** for secrets
3. **Enable HTTPS** with reverse proxy (Nginx/Traefik)
4. **Set secure CORS** settings in Django
5. **Regular backups** of database

## 🐛 Troubleshooting

### Frontend can't connect to backend
```bash
# Check backend is running
docker-compose ps

# Check backend logs
docker-compose logs backend

# Verify API URL in frontend/.env.local
VITE_API_URL=http://localhost:8000/blog/api/v1
```

### Database connection errors
```bash
# Check database health
docker-compose exec db pg_isready -U blog_user

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Permission errors
```bash
# Fix permissions
sudo chown -R $USER:$USER .

# Or run as root
docker-compose exec -u root backend sh
```

## 📝 Common Tasks

### Add Django Package
```bash
# Enter backend container
docker-compose exec backend sh

# Install package
pip install package-name

# Update requirements.txt
pip freeze > requirements.txt

# Rebuild
docker-compose build backend
```

### Add Frontend Package
```bash
# Enter frontend container
docker-compose exec frontend sh

# Install package
npm install package-name

# Rebuild
docker-compose build frontend
```

