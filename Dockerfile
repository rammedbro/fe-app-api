FROM node:20.6.1-alpine

RUN corepack enable pnpm
WORKDIR /app
COPY . .
RUN pnpm install --production
CMD ["node", "build"]
EXPOSE 3000
