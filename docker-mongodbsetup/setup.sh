#!/bin/bash

./wait-for-it.sh mongodb1:27017

mongosh --host mongodb1:27017 < ./setup.js
