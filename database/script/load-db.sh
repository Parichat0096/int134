#!/bin/bash

set -e  # หยุดเมื่อเกิด error

DB_CONTAINER="pl1-db"
ENV_FILE="$(dirname "$0")/../../backend/.env"
SQL_FILE="$(dirname "$0")/../dml.sql"

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

echo "📦 Loading base data into table 'study_plans'..."
docker exec -i "$DB_CONTAINER" \
  mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$SQL_FILE"
