#!/bin/bash
DATABASE=$1
MIGRATIONS=./database/migrations/*.sql
echo "Applying releases on database: $DATABASE "

for script in $MIGRATIONS; do
    echo "Applying script $script"
    #sqlite3 $DATABASE < $script || break
    cat $script | sqlite3 $DATABASE || break
done

echo "Database ready"
