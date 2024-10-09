FROM node:lts-alpine AS base
RUN apk update
RUN apk add --no-cache libc6-compat
RUN npm install -g turbo


FROM base AS pruner
WORKDIR /app

COPY . .
RUN turbo prune server --docker


FROM base AS installer
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/full/turbo.json .

RUN yarn install


FROM base AS sourcer
WORKDIR /app

COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .
COPY .gitignore .gitignore

RUN turbo run build --filter=server...


FROM base AS runner
WORKDIR /app

COPY --from=sourcer /app/ .

CMD [ "node", "apps/backend/dist/main.js" ]