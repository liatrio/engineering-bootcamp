# syntax=docker/dockerfile:1

# ---- build: compile the SPA with Node ----
FROM node:24.22.3-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
# No install scripts are needed to build; skipping them keeps the build hermetic.
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# ---- runtime: static files on unprivileged nginx (runs as uid 101, listens on 8080) ----
FROM nginxinc/nginx-unprivileged:1.29.8-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
# No HEALTHCHECK: compose defines health checks (see SPEC.md).
