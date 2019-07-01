# example-service

## Database

Backup file to restore the database is in ./sql-script/example_service.backup

## Configurations in the .env file

Add new .env file to root application folder

### db

DB_CONNECTION_STRING = postgres://login:password@localhost:5432/example_service

### oauth2, google provider

GOOGLE_CALLBACK_URL = http://localhost:3000/auth/google/callback
GOOGLE_CLIENT_ID =
GOOGLE_CLIENT_SECRET =
