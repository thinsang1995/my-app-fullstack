# Dockerfile

# Build stage
FROM node:20 AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# Production stage
FROM node:20

WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN yarn install --production

EXPOSE 3000

CMD ["yarn", "start"]