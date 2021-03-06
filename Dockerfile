FROM node:14
WORKDIR /usr/src  
COPY package*.json ./  
RUN npm install  
EXPOSE 8080
CMD ["npm", "run", "dev"]