#!/bin/bash
echo waiting 60 seconds for innodb to boot...

sleep 60

echo starting node /app/build/src/index.js

nodemon --legacy-watch /app/build/src/index.js