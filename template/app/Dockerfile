FROM node:14.17.4-alpine
WORKDIR /app

COPY ["package.json", "package-lock.json*", "/app/"]
RUN npm install --production 

COPY . /app
EXPOSE 80
CMD ["npm", "start"]