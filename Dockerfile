FROM node:9
EXPOSE 4000
WORKDIR /usr/src/app

# node dependency layer
COPY package*.json ./
RUN npm install

# app layer
COPY . .
CMD [ "npm", "start" ]
