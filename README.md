# Como rodar

## Crie a imagem

```bash
docker build -t desafio-fullcycle .
```

## Cria um container e um volume com o código da raiz montado no container

```bash
docker run -d --name desafio-fullcycle-dev -v "$(pwd)/src:/app/src" desafio-fullcycle tail -f /dev/null
```

## Acesse o container para rodar os testes

```bash
docker exec -it desafio-fullcycle-dev bash
```

## Rode os testes

```bash
npm test
```

## Remova o container

```bash
docker rm -f desafio-fullcycle-dev
```