#!/bin/bash
echo "Creating Individual status and individual tables"
sqlite3 prisma/bank.sqlite < prisma/migrations/20210207154559_r1_individuals_sql/migration.sql

echo "Loading individual status dictionary"
sqlite3 prisma/bank.sqlite < database/seed/individual-status.dictionaty.sql 

echo "Loading the master and test user to individuals"
sqlite3 prisma/bank.sqlite < database/seed/individual.base.sql 
