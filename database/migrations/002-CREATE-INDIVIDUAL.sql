CREATE TABLE Individual (
    id varchar(36) NOT NULL PRIMARY KEY,
    first_name varchar(63) NOT NULL,
    last_name varchar(127) NOT NULL,
    date_of_birth string NOT NULL,
    phone_number varchar(16) NOT NULL,
    email varchar(128) NOT NULL,
    country_code char(2) NOT NULL,
    street1 text NOT NULL,
    street2 text,
    city text NOT NULL,
    region text NOT NULL,
    postal_code text NOT NULL,
    individual_status_code char(3),
    FOREIGN KEY (individual_status_code) references individualStatus(code)
);