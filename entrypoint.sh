#!/bin/sh

echo "Esperando a la base de datos..."
until nc -z postgres 5432; do
  sleep 1
done

echo "Aplicando migraciones y ejecutando seed..."
pnpm db:reset

echo "Iniciando servidor backend..."
pnpm dev:server
