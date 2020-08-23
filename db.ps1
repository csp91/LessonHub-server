docker rm -f lessonpsql

docker run -d -p 5555:5432 -e POSTGRES_HOST_AUTH_METHOD=trust --name lessonpsql postgres:latest

docker cp schema.sql lessonpsql:/schema.sql

Start-Sleep -Seconds 5

docker exec lessonpsql psql -U postgres -f /schema.sql