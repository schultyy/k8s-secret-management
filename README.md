# Secrets 

## Local

```bash
docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -v ./seed.sql:/docker-entrypoint-initdb.d/bootstrap.sql -p 5432:5432 -d postgres
PGUSER=postgres PGPASSWORD=mysecretpassword node index.js
```

