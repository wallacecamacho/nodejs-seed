# Visão Geral - Está é uma aplicação Seed nodejs

# Passport
# Mongoose
# MongoDB
# Joi
# Winston
# Mocha
# Sinon
# EsLint-AirBnd

Projeto categoria-dashboard-backend responsável por gerar relatório e gráfico das categorias disponibilizadas.

## Responsáveis

- Wallace Camacho Carlos <wccarlos@stefanini.com>
- Colega de Time <colega@email.com>

## Rodando o projeto

- `npm start ou yarn start`: inicia o servidor em desenvolvimento.
- `npm start:prod ou yarn start:prod`: inicia o servidor em produção.

## Rodando os testes

- `npm test ou yarn test`: roda os testes unitários com os relatorios do nyc
- `npm run test:dev ou yarn test:dev`: roda os testes unitários sem o nyc
- `npm run integration ou yarn integration`: roda os testes integrados

## Urls

### Homologação

- [http://url.homologacao](http://url.homologacao)

### Produção

- [http://url.producao](http://url.producao)

## Servidores de aplicação

### Homologação

- servidor-de-homologacao

### Produção

- servidor-de-producao-1
- servidor-de-producao-2
- servidor-de-producao-3
- servidor-de-producao-4
- servidor-de-producao-5

## MongoDB

### Homologação

- mogo.homologacao:27017/database

### Produção

- mogo.producao-1:27017/database
- mogo.producao-2:27017/database
- mogo.producao-3:27017/database

## Jenkins

- [Deploy da Master](http://jenkins/job/...)
- [Deploy de releases](http://jenkins/job/...)
- [Restart da aplicação](http://jenkins/job/...)

## Kibana

### Homologação

- [http://kibana.homologacao:5601/app/kibana](http://kibana.homologacao:5601/app/kibana)

Indice: indice-hml*

### Produção

- [http://kibana.producao:5601/app/kibana](http://kibana.producao:5601/app/kibana)

Indice: indice-prd*

## Grafana

- [http://grafana:3000/dashboard/...](http://grafana:3000/dashboard/...)

## Postman

Arquivo de requests do Postman com todas as chamadas do projeto.

[https://www.getpostman.com/collections/cf95a463ebdaa24da76b](https://www.getpostman.com/collections/seu-share-do-postman)

[<img src="https://run.pstmn.io/button.svg">](https://app.getpostman.com/run-collection/cf95a463ebdaa24da76b#?env%5Blocalhost%5D=W3sia2V5IjoibG9jYWwiLCJ2YWx1ZSI6ImxvY2FsaG9zdDozMDAxIiwiZGVzY3JpcHRpb24iOiIiLCJ0eXBlIjoidGV4dCIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoibG9jYWxzZWMiLCJ2YWx1ZSI6Imh0dHBzOi8vbG9jYWxob3N0OjM0NDMiLCJkZXNjcmlwdGlvbiI6IiIsInR5cGUiOiJ0ZXh0IiwiZW5hYmxlZCI6dHJ1ZX1d)[<img src="https://run.pstmn.io/button.svg">]
