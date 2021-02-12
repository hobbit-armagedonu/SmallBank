#!/bin/bash

DATABASE=prisma/unit_test.sqlite
if test -f "$DATABASE"; then
    echo "Cleaning-up existing unit-test database: $DATABASE"
    rm $DATABASE
fi

echo "Applying releases"

database/applyMigrationsSQLite.sh $DATABASE

echo "Seeding unit test data"
SEEDS=./database/integrationTestMigrations/*.sql
for script in $SEEDS; do
    echo "Applying seed script $script"
    cat $script | sqlite3 $DATABASE || break
done
