-- One PostgreSQL server, one database per service.
-- Each service owns its database: no service reads another service's tables.
-- This runs once, the first time the postgres volume is created.
CREATE DATABASE employees;
CREATE DATABASE projects;
CREATE DATABASE assignments;
