# Makefile untuk mempermudah Docker operations

.PHONY: help dev prod build clean logs stop

# Default target
help:
	@echo "Available commands:"
	@echo "  dev       - Start development environment"
	@echo "  prod      - Start production environment"
	@echo "  build     - Build production image"
	@echo "  clean     - Clean Docker resources"
	@echo "  logs      - Show application logs"
	@echo "  stop      - Stop all containers"
	@echo "  restart   - Restart services"
	@echo "  shell     - Open shell in running container"

# Development environment
dev:
	docker-compose --profile dev up --build

dev-d:
	docker-compose --profile dev up -d --build

# Production environment
prod:
	docker-compose --profile prod up --build

prod-d:
	docker-compose --profile prod up -d --build

# Build production image
build:
	docker build -t appiks:latest .

build-dev:
	docker build -f Dockerfile.dev -t appiks:dev .

# Show logs
logs:
	docker-compose logs -f

logs-app:
	docker-compose logs -f app

# Stop services
stop:
	docker-compose down

stop-all:
	docker-compose --profile dev --profile prod down

# Restart services
restart-dev:
	docker-compose --profile dev restart

restart-prod:
	docker-compose --profile prod restart

# Clean up
clean:
	docker-compose down --rmi all --volumes --remove-orphans
	docker system prune -f

clean-all:
	docker system prune -a -f --volumes

# Open shell in container
shell:
	docker-compose exec app sh

shell-dev:
	docker-compose exec app-dev sh

# Health check
health:
	curl -f http://localhost:3000/api/health || echo "Health check failed"

# Database operations (jika menggunakan database)
# db-migrate:
# 	docker-compose exec app npm run db:migrate

# db-seed:
# 	docker-compose exec app npm run db:seed
