#!/bin/bash
echo "Creating Individual status"
sqlite3 bank.sqlite < database/migrations/001-CREATE-INDIVIDUAL-STATUS.sql

echo "Creating Individual"
sqlite3 bank.sqlite < database/migrations/002-CREATE-INDIVIDUAL.sql

echo "Loading individual status dictionary"
sqlite3 bank.sqlite < database/seed/individual-status.dictionaty.sql 

echo "Loading the master and test user to individuals"
sqlite3 bank.sqlite < database/seed/individual.base.sql 
