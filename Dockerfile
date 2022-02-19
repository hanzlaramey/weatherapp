FROM node:14-alpine

ENV NODE_ENV=production

# RUN apk add git

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

RUN mkdir /app
WORKDIR /app

COPY . .

RUN npm install --production --quiet
RUN npm run build-server
RUN npm run build-client

EXPOSE 4000

CMD ["dumb-init", "npm", "start"]