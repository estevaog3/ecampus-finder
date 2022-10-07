# ecampus-finder

Buscador de turmas de outros cursos na solicitação de matrícula da UFAM no ecampus.

## 💡 Motivação

O ecampus é o portal onde alunos da UFAM realizam matrículas em turmas a cada semestre. 
Porém, nele não é possível buscar turmas por nome, horário ou dias da semana em que as aulas acontecem.
Por isso, nada melhor que um projetinho para aprender coisas novas e ao mesmo tempo ajudar estudantes a encontrarem facilmente turmas de outras disciplinas 😺

## 🚀 Como executar

Certifique-se de que você tem os seguintes programas já instalados:

- [yarn](https://yarnpkg.com/getting-started/install) ou [NPM](https://docs.npmjs.com/cli/v8/configuring-npm/install)
- [Docker](https://docs.docker.com/desktop/install/linux-install/) versão 20.10.18
- [Node](https://nodejs.org/en/) versão 16.14.2

Instale as demais dependências do projeto com os comandos a seguir:
```
cd backend && yarn install && cd ..
cd frontend && yarn install
```

## Como rodar

```
# 1) Inicie o servidor de busca Elasticsearch.
# [IMPORTANTE]: 
# Note que você pode limitar o uso de memória dele através da variável ES_JAVA_OPTS. Isso pode ser útil se você tiver pouca memória RAM disponível. 
# O valor definido no comando já deve funcionar para a maioria dos casos, em computadores de 8GB de RAM. 
docker run -d -p 127.0.0.1:9200:9200 -p 127.0.0.1:9300:9300 -e "discovery.type=single-node" -e ES_JAVA_OPTS="-Xms1g -Xmx1g" docker.elastic.co/elasticsearch/elasticsearch:7.17.3

# 2) Inicie o servidor de backend
in progress...
# 3) in progress... 
```

