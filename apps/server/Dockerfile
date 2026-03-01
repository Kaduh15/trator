FROM node:20-alpine AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

COPY . .
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm --filter server build

FROM node:20-alpine
WORKDIR /app/apps/server
ENV NODE_ENV=production

COPY --from=build /app /app

EXPOSE 3000
CMD ["node", "dist/index.mjs"]
