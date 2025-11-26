#!/bin/bash

# Define a color for headers (Cyan)
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# --- 1. Docker Containers Status ---
echo -e "${CYAN}=== Docker Containers Status (All) ===${NC}"
# Displays all containers (running and stopped)
docker ps -a

# --- 2. Check if all containers are running ---
echo -e "\n${CYAN}=== Check if all containers are running ===${NC}"

# Iterate through all containers and check their status explicitly
# The format outputs Name and Status (e.g., "Up 5 hours" or "Exited (0) 2 minutes ago")
docker ps -a --format "{{.Names}}\t{{.Status}}" | while IFS=$'\t' read -r name status; do
    # Check if the status string contains "Up" (indicating a running container)
    if [[ "$status" =~ "Up" ]]; then
        echo "$name ($status) ✅ Running"
    else
        echo "$name ($status) ❌ Not Running"
    fi
done

# --- 3. Backend Logs ---
echo -e "\n${CYAN}=== Backend Logs (last 20 lines) for express_backend ===${NC}"
# Use --tail 20 to get the last 20 lines
docker logs --tail 20 express_backend

# --- 4. Frontend Logs ---
echo -e "\n${CYAN}=== Frontend Logs (last 20 lines) for nginx_frontend ===${NC}"
docker logs --tail 20 nginx_frontend

# --- 5. Nginx Proxy Logs ---
echo -e "\n${CYAN}=== Nginx Proxy Logs (last 20 lines) for nginx_proxy ===${NC}"
docker logs --tail 20 nginx_proxy

echo -e "\n${CYAN}=== Script Finished ===${NC}"
