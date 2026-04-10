#!/bin/bash

set -e
set -u

echo "  Enabling pgvector extension in 'ai' database..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "ai" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS vector;
EOSQL
echo "  pgvector extension enabled in 'ai' database"

