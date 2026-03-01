# apps/server/Dockerfile
FROM node:20-alpine AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

COPY . .
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm --filter server build

FROM node:20-alpine AS runtime
WORKDIR /app/apps/server
ENV NODE_ENV=production

# copia tudo porque pnpm usa links; é mais simples do que “meia cópia”
COPY --from=build /app /app

EXPOSE 3000
CMD ["node", "dist/index.mjs"]