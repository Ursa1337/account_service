FROM node:18

RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY . /home/node/app
RUN npm install

RUN npm run build

USER node

CMD ["npm", "run", "start:prod"]