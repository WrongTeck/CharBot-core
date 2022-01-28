#!/bin/bash

npm i
npm i -g typescript
if [ -e "/usr/bin/sudo" ]; then
  sudo npm i -g typescript
else
  npm i -g typescript
fi
tsc
g++ -o start src/startCharBot.cpp
echo "Done!";
