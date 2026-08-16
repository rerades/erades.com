# Production image for erades.com

FROM node:22-slim AS builder

# Enable Corepack and install pnpm at fixed version
ARG PNPM_VERSION=10.27.0
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

WORKDIR /app

# Install dependencies based on lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code and build the site
COPY . .
RUN pnpm run build

# --- Runtime image ---
FROM node:22-slim AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy built output
COPY --from=builder /app/dist ./dist

# Ensure non-root permissions
RUN chown -R node:node /app
USER node

# Platform injects PORT (Render, etc.). Default to 8080.
ENV PORT=8080
EXPOSE 8080

CMD ["node", "./dist/server/entry.mjs"]
