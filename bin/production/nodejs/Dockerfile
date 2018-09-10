FROM node:8

RUN useradd --user-group --create-home --shell /bin/false app &&\
  npm install --global npm

ENV HOME=/home/app

COPY COPY package*.json ./ $HOME/library/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/library
RUN npm cache clean && npm install --silent --progress=false

USER root
COPY . $HOME/library
RUN chown -R app:app $HOME/*
USER app

CMD ["npm", "start"]