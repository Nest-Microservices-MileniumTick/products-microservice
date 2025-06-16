# Product Microservice

## Development

1. Clonar el repositorio
2. Instalar las dependencias `bun install`
3. Crear un archivo `.env` basado en el `.env.template`
4. Ejecutar migracion de prisma `bunx prisma migrate dev`
5. Levantar el servidor NATS
```bash
podman run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
```
6. Ejecutar `bun run start:dev`