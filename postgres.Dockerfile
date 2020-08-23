FROM library/postgres
COPY schema.sql /docker-entrypoint-initdb.d/
