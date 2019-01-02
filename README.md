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
docker build -t my-microservice .
```

### Start the docker container

```[bash]
docker run -p 3000:3000 -it my-microservice
```

## Supporting

- [x] Travis CI
- [ ] Docker
- [x] Github templates
- [x] Unit tests
- [x] API tests
- [x] ES lint
- [ ] docker-compose
- [ ] Kubernetes deployment files (via kompose)
- [x] Prometheus metrics observation & endpoint
- [ ] Grafana dashboard