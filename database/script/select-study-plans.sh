#!/bin/bash
# select-study-plans.sh
# แสดงข้อมูลทั้งหมดจากตาราง study_plans ภายใน container pl1-db

set -e

DB_CONTAINER="pl1-db"
ENV_FILE="$(dirname "$0")/../../backend/.env"

# โหลด environment variables ถ้ามี .env
if [ -f "$ENV_FILE" ]; then
  set -a
  source "$ENV_FILE"
  set +a
else
  echo "⚠️  Warning: $ENV_FILE not found, using default values."
  DB_HOST="db"
  DB_USER="root"



  
  DB_PASSWORD="int504"
  DB_NAME="pl1"
fi

docker exec -i "$DB_CONTAINER" \
  mysql --default-character-set=utf8mb4 \
  -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME; SELECT * FROM study_plans;"

