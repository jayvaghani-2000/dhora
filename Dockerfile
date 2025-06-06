FROM node:lts-alpine AS base
ARG NODE_ENV

FROM oven/bun:1 as install
WORKDIR /app

COPY package.json bun.lockb next.config.mjs ./

RUN bun i --frozen-lockfile

FROM base as builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY . .
COPY --from=install /app/node_modules ./node_modules

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=install /app/node_modules ./node_modules
COPY --from=install /app/package.json ./package.json
COPY --from=install /app/next.config.mjs ./next.config.mjs
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/.env ./.env

USER nextjs

EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}
ENV PORT 3000

CMD npm run start