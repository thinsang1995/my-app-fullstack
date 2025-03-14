# Build stage
FROM node:16 AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# Production stage
FROM node:16

WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

RUN yarn install --production

# Install PM2 globally
RUN npm install -g pm2

EXPOSE 3000

# Run migrations and start the app
CMD ["pm2-runtime", "start", "yarn", "--", "start"]