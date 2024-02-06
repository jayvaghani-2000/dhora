FROM node:lts-alpine as base
WORKDIR /usr/src/app

FROM base AS build
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
RUN npm prune --production

FROM base AS release
COPY package.json .env ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
