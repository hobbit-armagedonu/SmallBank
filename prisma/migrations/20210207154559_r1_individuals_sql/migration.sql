-- CreateTable
CREATE TABLE "IndividualStatus" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "status_name" TEXT NOT NULL,
    "status_description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Individual" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "date_of_birth" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "street1" TEXT NOT NULL,
    "street2" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "individual_status_code" TEXT NOT NULL,
    FOREIGN KEY ("individual_status_code") REFERENCES "IndividualStatus" ("code") ON DELETE CASCADE ON UPDATE CASCADE
);
