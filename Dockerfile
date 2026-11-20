# Build stage: the site loads everything through dist/main.js, which is gitignored,
# so build it here instead of relying on whatever dist/ is in the build context.
FROM node:alpine AS build

WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY src ./src
COPY webpack.common.ts webpack.prod.ts tsconfig.json .bablerc ./
RUN npm run build:prod

# Runtime stage
FROM node:alpine

RUN npm install -g docsify-cli@latest
RUN mkdir -p /usr/local/docsify

## Container dnvironment variables
ENV DEBUG 0
ENV PORT 3000
ENV DOCSIFY_VERSION latest
ENV NODE_VERSION alpine

# Copy docsify files, then the freshly built bundle
COPY . /usr/local/docsify
COPY --from=build /build/dist /usr/local/docsify/dist

## Container runtime configuration
EXPOSE 3000
WORKDIR /usr/local/docsify

## Container entry point. docsify serve binds to localhost by default, which is
## unreachable through a published port, so bind to all interfaces.
ENTRYPOINT [ "docsify", "serve", "--host", "0.0.0.0", "--port", "3000" ]

## Container entry point default arguments
CMD [ "." ]
