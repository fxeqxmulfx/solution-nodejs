FROM node:20.3.1-bullseye-slim as builder
WORKDIR /build
COPY ./src ./src
COPY package.json ./
COPY package-lock.json ./
RUN npm ci && npm run build

FROM node:20.3.1-bullseye-slim as runner
WORKDIR /app
COPY --from=builder /build/dist ./
RUN apt-get update && apt-get install -y curl

ENV NODE_ENV production
ENV TZ='UTC'
ENV PGPORT=5432
ENV PGDATABASE=postgres
ENV LOG_LEVEL=info

ENV PGHOST=CHANGE_ME
ENV PGUSER=CHANGE_ME
ENV PGPASSWORD=CHANGE_ME

HEALTHCHECK CMD ["curl", "-f", "http://localhost:3000/healthcheck"]
ENTRYPOINT ["node", "index.js"]
EXPOSE 3000
