#!/bin/bash

./wait-for-it.sh mongodb1:27017

mongosh --host mongodb1:27017 < ./setup.js

echo "Node app setup completed, you can now access the web app"
