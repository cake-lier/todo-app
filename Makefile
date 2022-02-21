SHELL=/bin/bash

NODEAPP_IMAGE=nodeapp
MONGODB_IMAGE=mongodb

MONGODB_DOCKERFILE_PATH=./docker-mongodb
 
all: build up 
 
.PHONY: build up down clean
 
build:  
	docker build -t ${NODEAPP_IMAGE} . 
	cd ${MONGODB_DOCKERFILE_PATH}; docker build -t ${MONGODB_IMAGE} .
 
up: 
	docker compose up | grep ${NODEAPP_IMAGE}

down:
	docker compose down
 
clean: 
	docker compose down --rmi all
