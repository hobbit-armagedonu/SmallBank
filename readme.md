# Welcome

The little bank project shows the author can do things. It's not a complete working API but you can run it and enjoy the nice code.

# Prerequisites

To work with sqlite it's good to install sqlite3 on your machine.

# Installation

This API is supposed to be run on a linux OS.

Pull the repository
run
npm install
npm run create-local-db

# Starting the service

npm run start-locally

# Database

At this point SmallBank is using sqlite. You can modify the driver easily by changing the prisma schema db provider.

To introduce changes in database structure first modify the prisma schema. Then run
npm run generate-prisma-migration

Please note auto-generated migration scripts suck. Additionally the prisma migration tool works in a preview feature mode. Use the auto-generated schema wisely:
* remove any ON * CASCADE clauses
* make sure the sequence is right
* remember about seeding dictionaries
* and save scripts in database/migrations

When running integration tests all your migrations will be run in sequence from that directory.

If you want to release your schema changes I encourage you to create a separate shell for every release. It's also smart to include a rollback.

# Testting

Tests are divided into two groups: unit and integration. Create tests under proper directory in tests. Make sure you stub as much as possible in unit tests. When writing integration tests you can rely on separate test-only database as long as you include testSetup.js and execute the setup before writing any scenarios. You should not use setup in unit tests. Unit tests should be fast! Just don't think you can release stuff without running integration suite.

# Style

If you're planning on contributing to this project please take advantage of ESlint

# Running on Windows / MacOs

You should be able to run it on MacOS without issues. Not tested yet.
Runnig it on windows will require some patience. You need to modify the .sh scripts to .bat equivalents and you shoul be fine.
Nevertheless; install a linux and run free.

# Note

The name refers to Lieutenant Gruber's Small Tank
https://www.youtube.com/watch?v=NcsRhNWzQEI
