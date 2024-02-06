FROM node:19.5.0-alpine
WORKDIR /src
COPY package.json yarn.lock ./
RUN yarn install --ignore-engines
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["npm", "start"]
