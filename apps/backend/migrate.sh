#!/bin/sh

echo "Waiting for database to be ready..."
sleep 10

echo "Running Prisma migration..."
pnpm prisma db push

echo "Migration completed successfully!" 