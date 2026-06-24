# Optional self-host image. Juzubi primarily deploys on Vercel; this Dockerfile
# lets you run the same app (incl. the AI photo generator) on any container host.
FROM node:20-slim AS base
WORKDIR /app
# sharp needs libc; node:20-slim already ships a compatible glibc.

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci || npm install

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS run
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "run", "start"]
