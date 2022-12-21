
# O objetivo de subir o projeto no docker é tornar ele agnóstico à sistemas operacionais e problemas relacionados à diferentes ambientes

FROM node:16
WORKDIR /usr/projects/clean-node-api
COPY ./package.json .
RUN npm install --only=prod
COPY ./dist ./dist
EXPOSE 5000
CMD npm start