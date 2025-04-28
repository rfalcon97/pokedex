# 1. Instalar dependencias base
FROM node:22.15.0-alpine3.15 AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# 2. Build de la aplicación
FROM node:22.15.0-alpine3.15 AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# 3. Imagen final para producción
FROM node:22.15.0-alpine3.15 AS runner
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install --only=production --legacy-peer-deps

COPY --from=builder /app/dist ./dist

# Exponer el puerto si quieres
# EXPOSE 3000

# Comando para arrancar la app
CMD ["node", "dist/main"]
