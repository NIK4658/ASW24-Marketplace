# aws24-marketplace

Basic AWS Marketplace with Vue 3.

## Start the MongoDB server on localhost

Go to the MongoDB dockerfile:

```
cd backend/db/
```

Then run:

```
docker compose up -d
```

## Start the backend

In the backend folder, run:

```
node .
```

## Start the frontend

In the frontend folder, run:

```
npm run dev
```

## Build the frontend

In the frontend folder, run:

```
npm run build
```

### Self-hosted the built frontend

Move inside the nginx in the frontend and run:

```
docker compose up -d
```

Then go to the browser and open:

```
http://localhost:8080
```