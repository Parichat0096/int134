#!/bin/bash

# Define colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

DOCKER_COMPOSE_FILE="docker-compose.yml"

echo -e "${YELLOW}==========================================${NC}"
echo -e "${CYAN}  Starting Full Docker Redeploy Sequence  ${NC}"
echo -e "${YELLOW}==========================================${NC}"

# --- 1. STOP & CLEANUP ---
echo -e "\n${RED}>>> STEP 1: Stopping and Cleaning up Existing Environment...${NC}"

# Command: docker-compose down -v --rmi all --remove-orphans
# -v: Remove named volumes declared in the volumes section of the Compose file and anonymous volumes.
# --rmi all: Remove all images used by any service.
# --remove-orphans: Remove containers for services that are not defined in the Compose file anymore.
docker-compose -f ${DOCKER_COMPOSE_FILE} down -v --rmi all --remove-orphans

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SUCCESS: Existing containers, volumes, and images have been cleaned up.${NC}"
else
    echo -e "${RED}❌ ERROR: Failed during cleanup phase (docker-compose down). Exiting.${NC}"
    exit 1
fi

# --- 2. BUILD & START ---
echo -e "\n${GREEN}>>> STEP 2: Building New Images and Starting Services...${NC}"

# Command: docker-compose -f docker-compose.yml up --build -d
# -f ${DOCKER_COMPOSE_FILE}: Specify the compose file
# --build: Build images before starting containers.
# -d: Run containers in detached mode (in the background).
docker-compose -f ${DOCKER_COMPOSE_FILE} up --build -d

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SUCCESS: All services have been built and started successfully.${NC}"
else
    echo -e "${RED}❌ ERROR: Failed during build and start phase (docker-compose up).${NC}"
    exit 1
fi

# --- 3. VERIFICATION ---
echo -e "\n${CYAN}>>> STEP 3: Verifying Running Containers...${NC}"
docker ps

echo -e "\n${YELLOW}==========================================${NC}"
echo -e "${CYAN}    Redeploy Sequence Complete.           ${NC}"
echo -e "${YELLOW}==========================================${NC}"
