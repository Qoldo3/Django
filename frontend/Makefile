.PHONY: help build up down logs clean migrate test shell

# Colors
YELLOW := \033[1;33m
GREEN := \033[1;32m
RESET := \033[0m

help: ## Show this help
	@echo "$(GREEN)Available commands:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}'

# Production commands
build: ## Build production images
	docker-compose build

up: ## Start production containers
	docker-compose up -d

down: ## Stop all containers
	docker-compose down

logs: ## View logs
	docker-compose logs -f

ps: ## List running containers
	docker-compose ps

restart: ## Restart all services
	docker-compose restart

# Development commands
dev-build: ## Build development images
	docker-compose -f docker-compose.dev.yml build

dev-up: ## Start development containers with hot reload
	docker-compose -f docker-compose.dev.yml up

dev-down: ## Stop development containers
	docker-compose -f docker-compose.dev.yml down

dev-logs: ## View development logs
	docker-compose -f docker-compose.dev.yml logs -f

# Database commands
migrate: ## Run Django migrations
	docker-compose exec backend python manage.py migrate

makemigrations: ## Create Django migrations
	docker-compose exec backend python manage.py makemigrations

createsuperuser: ## Create Django superuser
	docker-compose exec backend python manage.py createsuperuser

dbshell: ## Access database shell
	docker-compose exec db psql -U blog_user -d blog_db

# Testing
test: ## Run backend tests
	docker-compose exec backend pytest

test-frontend: ## Run frontend tests (if configured)
	docker-compose exec frontend npm test

# Utilities
shell: ## Access Django shell
	docker-compose exec backend python manage.py shell

backend-shell: ## Access backend container bash
	docker-compose exec backend sh

frontend-shell: ## Access frontend container bash
	docker-compose exec frontend sh

# Cleanup
clean: ## Remove all containers, volumes, and images
	docker-compose down -v --rmi all
	docker system prune -af

clean-volumes: ## Remove all volumes (WARNING: deletes data!)
	docker-compose down -v

# Production deployment
prod-build: ## Build for production
	docker-compose build --no-cache

prod-up: ## Start production with fresh build
	docker-compose up -d --build

# Backup & Restore
backup-db: ## Backup database
	docker-compose exec -T db pg_dump -U blog_user blog_db > backup_$$(date +%Y%m%d_%H%M%S).sql

restore-db: ## Restore database (usage: make restore-db FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then echo "Error: Please specify FILE=backup.sql"; exit 1; fi
	docker-compose exec -T db psql -U blog_user blog_db < $(FILE)

# Initial setup
init: ## Initialize project (first time setup)
	@echo "$(GREEN)Building containers...$(RESET)"
	docker-compose build
	@echo "$(GREEN)Starting services...$(RESET)"
	docker-compose up -d
	@echo "$(GREEN)Waiting for database...$(RESET)"
	sleep 5
	@echo "$(GREEN)Running migrations...$(RESET)"
	docker-compose exec backend python manage.py migrate
	@echo "$(GREEN)Creating superuser...$(RESET)"
	docker-compose exec backend python manage.py createsuperuser
	@echo "$(GREEN)Setup complete! Access:$(RESET)"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend Admin: http://localhost:8000/admin"
	@echo "  API: http://localhost:8000/blog/api/v1"

dev-init: ## Initialize development environment
	@echo "$(GREEN)Building development containers...$(RESET)"
	docker-compose -f docker-compose.dev.yml build
	@echo "$(GREEN)Starting development services...$(RESET)"
	docker-compose -f docker-compose.dev.yml up -d
	@echo "$(GREEN)Waiting for database...$(RESET)"
	sleep 5
	@echo "$(GREEN)Running migrations...$(RESET)"
	docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate
	@echo "$(GREEN)Development setup complete!$(RESET)"
	@echo "  Frontend (Hot Reload): http://localhost:5173"
	@echo "  Backend: http://localhost:8000"