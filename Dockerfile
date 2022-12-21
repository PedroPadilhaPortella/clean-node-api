
# O objetivo de subir o projeto no docker é tornar ele agnóstico à sistemas operacionais e problemas relacionados à diferentes ambientes

# Este é apenas um arquivo de instruções para o que o docker vai executar pra subir o projeto

# docker build clean-node-api .
# docker run -it clean-node-api sh
# docker run -p 5000:5000 clean-node-api

FROM node:16
WORKDIR /usr/projects/clean-node-api
COPY ./package.json .
RUN npm install --production
COPY ./dist ./dist
EXPOSE 5000
CMD npm start