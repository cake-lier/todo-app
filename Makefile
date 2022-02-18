SHELL=/bin/bash

NODEAPP_IMAGE=nodeapp
MONGODB_IMAGE=mongodb 
MONGODB_SETUP_IMAGE=mongosetup

MONGODB_DOCKERFILE_PATH=./docker-mongodb
MONGODB_SETUP_DOCKERFILE_PATH=./docker-mongodbsetup
 
all: build up 
 
.PHONY: build up down clean
 
build:  
	docker build -t ${NODEAPP_IMAGE} . 
	cd ${MONGODB_DOCKERFILE_PATH}; docker build -t ${MONGODB_IMAGE} .
	cd ${MONGODB_SETUP_DOCKERFILE_PATH}; docker build -t ${MONGODB_SETUP_IMAGE} .
 
up: 
	docker compose up | grep -E "(?:${NODEAPP_IMAGE}|${MONGODB_SETUP_IMAGE})"

down:
	docker compose down
 
clean: 
	docker compose down --rmi all