FROM node:16-alpine

WORKDIR /app

ENV NODE_ENV='production'
ENV HOST='0.0.0.0'
ENV PORT='3000'
ENV SITE='example'
ENV BASE='//localhost:3000'

COPY . /app/

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]