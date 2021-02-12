#!/bin/bash
FILE1=$1

echo "Creating Individual status"
sqlite3 $FILE < database/migrations/001-CREATE-INDIVIDUAL-STATUS.sql

echo "Creating Individual"
sqlite3 $FILE < database/migrations/002-CREATE-INDIVIDUAL.sql

echo "Loading individual status dictionary"
sqlite3 $FILE < database/migrations/003-SEED-INDIVIDUAL-STATUS.sql

echo "Loading the master and test user to individuals"
sqlite3 $FILE < database/migrations/004-SEED-INDIVIDUAL.sql
