# Node.js Microservice Boilerplate

Fork this repo and build your microservice on top.

## Supporting

- [x] RAML
- [x] Travis CI
- [x] Docker
- [x] Github templates
- [x] Express.js API
- [x] Static file server
- [x] Example module
- [x] Unit tests
- [x] API tests
- [x] ES lint
- [ ] Automatic documentation
- [ ] docker-compose
- [ ] Kubernetes deployment files (via kompose)
- [ ] Prometheus metrics observation & endpoint
- [ ] Grafana dashboard

## Run with Docker

### Build the image from the repository

```[bash]
docker build -t my-microservice .
```

### Start the docker container

```[bash]
docker run -p 3000:3000 -it my-microservice
```

## Local development

### Copy repository and install dependencies

```[bash]
git clone https://github.com/tksventures/nodejs-boilerplate.git my-microservice
cd my-microservice
npm i
```

### Start the microservice

```[bash]
npm start
```

You can now access the Node.js app at [http://localhost:3000](http://localhost:3000)
