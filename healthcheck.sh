#!/bin/sh

# Health check script untuk Docker container
# File ini digunakan untuk memastikan aplikasi berjalan dengan baik

set -e

host="$(hostname -i || echo '127.0.0.1')"
port="${PORT:-3000}"

# Check if the application is responding
if wget --no-verbose --tries=1 --spider "http://${host}:${port}/api/health" >/dev/null 2>&1; then
    echo "Health check passed"
    exit 0
else
    echo "Health check failed"
    exit 1
fi
