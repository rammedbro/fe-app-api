FROM node:20.6.1-alpine

WORKDIR /var/www
COPY schema.prisma package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY build ./build
COPY packages ./packages
COPY node_modules/.prisma ./node_modules/.prisma
RUN corepack enable pnpm
RUN pnpm install --production --ignore-scripts
ENTRYPOINT ["node", "./build/index.js"]
