FROM --platform=linux/amd64 node:20.6.1-alpine

RUN corepack enable pnpm
WORKDIR /var/www
COPY . .
RUN pnpm install --production
ENTRYPOINT ["node", "./build"]
