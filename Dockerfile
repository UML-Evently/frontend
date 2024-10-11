FROM node:20-slim as front-builder

WORKDIR /usr/src/app

ARG NUXT_UI_PRO_LICENSE

ENV NUXT_UI_PRO_LICENSE=$NUXT_UI_PRO_LICENSE
ENV NODE_ENV=production

COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

FROM node:20-slim as front-runner

WORKDIR /usr/src/app

COPY --from=front-builder /usr/src/app/.output ./
EXPOSE 3000

ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=production

ENTRYPOINT ["node", "/usr/src/app/server/index.mjs"]