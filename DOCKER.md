# Docker Setup untuk Appiks

## Quick Start

### Development
```bash
# Build dan jalankan untuk development
docker-compose --profile dev up --build

# Atau jalankan dalam detached mode
docker-compose --profile dev up -d --build
```

### Production
```bash
# Build dan jalankan untuk production
docker-compose --profile prod up --build

# Atau dengan nginx reverse proxy
docker-compose --profile prod up --build
```

## File Structure
```
├── Dockerfile              # Production build dengan multi-stage
├── Dockerfile.dev         # Development build
├── docker-compose.yml     # Orkestrasi containers
├── .dockerignore         # Files yang dikecualikan dari build context
├── nginx.conf            # Nginx configuration untuk production
└── .env.example          # Template environment variables
```

## Best Practices yang Diimplementasikan

### 1. Multi-stage Build (Dockerfile)
- **deps**: Install dependencies saja
- **builder**: Build aplikasi
- **runner**: Runtime production yang minimal

### 2. Security
- Non-root user (nextjs:nodejs)
- Minimal alpine-based images
- Security headers di nginx
- Rate limiting untuk API endpoints

### 3. Performance
- Layer caching optimization
- Gzip compression
- Static assets caching
- Next.js standalone output

### 4. Development Experience
- Hot reload dengan volume mounting
- Separate development dockerfile
- Profile-based services

## Environment Variables

Copy `.env.example` ke `.env.local` dan sesuaikan:

```bash
cp .env.example .env.local
```

## Commands

### Development
```bash
# Start development environment
docker-compose --profile dev up

# Rebuild dan start
docker-compose --profile dev up --build

# Stop
docker-compose --profile dev down
```

### Production
```bash
# Start production environment
docker-compose --profile prod up

# Dengan rebuild
docker-compose --profile prod up --build

# Background mode
docker-compose --profile prod up -d

# Stop
docker-compose --profile prod down
```

### Single Container
```bash
# Build production image
docker build -t appiks:latest .

# Run production container
docker run -p 3000:3000 --env-file .env.local appiks:latest

# Development
docker build -f Dockerfile.dev -t appiks:dev .
docker run -p 3000:3000 -v $(pwd)/src:/app/src appiks:dev
```

## Nginx Configuration

File `nginx.conf` menyediakan:
- Reverse proxy ke Next.js app
- Gzip compression
- Static file caching
- Security headers
- Rate limiting
- Health check endpoint

## Troubleshooting

### Container tidak bisa start
1. Check ports: `docker ps` dan `lsof -i :3000`
2. Check logs: `docker-compose logs app`
3. Check environment variables

### Build gagal
1. Clear Docker cache: `docker system prune -a`
2. Check .dockerignore
3. Rebuild: `docker-compose build --no-cache`

### Performance issues
1. Check container resources: `docker stats`
2. Monitor dengan: `docker-compose top`
3. Check nginx logs untuk bottlenecks

## Production Deployment

Untuk deployment production:

1. Set environment variables yang benar
2. Configure SSL certificates di nginx
3. Setup database connections
4. Configure monitoring dan logging
5. Setup backup strategy

```bash
# Production deployment example
docker-compose --profile prod up -d
```
