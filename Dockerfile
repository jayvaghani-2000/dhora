FROM node:lts-alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock .env ./
RUN yarn install --ignore-engines
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["npm", "start"]
