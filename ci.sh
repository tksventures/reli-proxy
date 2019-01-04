#! /bin/bash

[[ $TRAVIS_PULL_REQUEST -ne false ]] && CURRENT_BRANCH=$TRAVIS_PULL_REQUEST_BRANCH || CURRENT_BRANCH=$TRAVIS_BRANCH

docker push tokesplatform/reli-proxy:$CURRENT_BRANCH

# here deploy to k8s
