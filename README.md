# aws24-marketplace

Basic AWS Marketplace with Vue 3.

## Start the MongoDB server on localhost with docker

Go to the MongoDB dockerfile:

```
cd backend/database/
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

## Self-hosted the built frontend with docker

Move inside the nginx folder in the frontend and run:

```
npm run deploy
```