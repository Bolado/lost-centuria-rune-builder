FROM node:lts-slim as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:lts-slim
WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/ ./

COPY --from=frontend-build /app/frontend/build ./static

EXPOSE 3000

ENV STATIC_DIR=/app/static

CMD ["node", "/app/index.js"]
