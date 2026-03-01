# ============================================================================
# Base Stage - Common setup
# ============================================================================
FROM node:20-alpine AS base
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.27.0 --activate
RUN pnpm config set store-dir /pnpm/store

# ============================================================================
# Dependencies Stage - Install all dependencies
# ============================================================================
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --parents apps/*/package.json ./
COPY --parents packages/*/package.json ./
RUN pnpm install --frozen-lockfile

# ============================================================================
# Production Dependencies Stage - Install only production deps
# ============================================================================
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --parents apps/*/package.json ./
COPY --parents packages/*/package.json ./
RUN pnpm install --frozen-lockfile --only=prod --ignore-scripts

# ============================================================================
# Build Stage - Compile the application
# ============================================================================
FROM deps AS build
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /pnpm /pnpm
COPY . .
RUN pnpm --filter server build

# ============================================================================
# Development Stage - For local development
# ============================================================================
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /pnpm /pnpm
COPY . .
EXPOSE 3000
CMD ["pnpm", "--filter", "server", "dev"]

# ============================================================================
# Production Stage - Minimal final image
# ============================================================================
FROM base AS prod
ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=prod-deps /app/apps/server/node_modules /app/apps/server/node_modules
COPY --from=prod-deps /pnpm /pnpm
COPY --from=build /app/apps/server/dist /app/apps/server/dist

WORKDIR /app/apps/server
EXPOSE 3000
CMD ["node", "dist/index.mjs"]
