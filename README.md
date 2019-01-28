# Node.js reverse-proxy with rate limiter and monitoring

## Test the microservice

```[bash]
npm test
```

## Start the microservice

```[bash]
npm start
```

You can now access the Node.js app at [http://localhost:4000](http://localhost:4000)

## Monitoring

The metrics used by Prometheus for monitoring, are exposed at `http://localhost:4000/metrics`

## WIP Run with Docker

### Build the image from the repository

```[bash]
docker build -t reli-proxy .
```

### Start the docker container

_Pass in Redis url in the environment variable_

```[bash]
docker run -p 4000:4000 --env-file ./.env.sample -it reli-proxy
```

### Run tests

```[bash]
docker-compose up --abort-on-container-exit
```

## Supporting

- [x] Travis CI
- [x] Docker image
- [x] Github templates
- [x] Unit tests
- [x] ES lint
- [x] docker-compose
- [ ] Kubernetes deployment files
- [x] Prometheus metrics observation & endpoint
- [ ] Grafana dashboard
