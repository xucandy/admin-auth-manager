FROM node:16
WORKDIR /app

COPY dist/ ./dist
COPY package.json ./
COPY ormconfig.json ./
RUN npm set  registry https://registry.npm.taobao.org/
RUN npm instal pm2 -g 
RUN npm install
CMD ["pm2-docker" ,"start" ,"src/main.js", "--watch"]