# ecampus-finder

Buscador de disciplinas optativas para a segunda solicitação de matrícula da UFAM no ecampus.

## 👌 Funcionalidades

- Busca por nome de disciplinas, cursos ou horários
- Filtro de dias da semana e de horários
    - Exemplo: buscar por disciplinas de "cálculo" somente segunda e quarta, entre 7:00 AM e 12:00 PM. 

## 💡 Motivação

O [ecampus](https://ecampus.ufam.edu.br/) é o portal em que alunos da UFAM realizam matrículas em turmas a cada semestre. 
Porém, nele não é possível buscar turmas por nome, horário ou dias da semana em que as aulas acontecem.
Por isso, nada melhor que um projetinho para aprender coisas novas e ao mesmo tempo ajudar estudantes a encontrarem facilmente turmas de outras disciplinas 😺

## 🚀 Como executar

Certifique-se de que você tem os seguintes programas já instalados:

- [yarn](https://yarnpkg.com/getting-started/install) ou [NPM](https://docs.npmjs.com/cli/v8/configuring-npm/install)
- [Docker](https://docs.docker.com/desktop/install/linux-install/) versão 20.10.18
- [Node](https://nodejs.org/en/) versão 16.14.2

Após clonar ete repositório, instale as demais dependências do projeto com os comandos a seguir:
```
cd backend && yarn install && cd ..
cd frontend && yarn install
```

### Como rodar

Siga o passo-a-passo para rodar localmente o EcampusFinder:

```
# 1) Inicie o servidor de busca Elasticsearch.
# Você pode limitar o uso de memória dele através da variável ES_JAVA_OPTS. O valor de 1GB definido deve funcionar bem em PCs de 8GB de RAM, recomendo experimentar com valores menores que 1GB caso sua máquina possua pouca memória.

docker run -d -p 127.0.0.1:9200:9200 -p 127.0.0.1:9300:9300 -e "discovery.type=single-node" -e ES_JAVA_OPTS="-Xms1g -Xmx1g" docker.elastic.co/elasticsearch/elasticsearch:7.17.3


# 2) Inicie a API de backend
cd backend && yarn start 

# 3) Inicie o frontend em outro terminal
cd frontend && yarn start

# Pronto! o EcampusFinder deve ter sido aberto automaticamente na URL localhost:3000.
```
