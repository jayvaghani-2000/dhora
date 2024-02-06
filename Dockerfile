FROM node:lts-alpine as base
WORKDIR /usr/src/app
COPY package.json yarn.lock .env ./

FROM base AS build
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM base AS release
RUN yarn install --frozen-lockfile --production
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
