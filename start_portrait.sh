#!/bin/bash

# run audio generation model
docker run -d -p 6688:5000 --gpus=all r8.im/lucataco/magnet@sha256:e8e2ecd4a1dabb58924aa8300b668290cafae166dd36baf65dad9875877de50e

# tunnel
ngrok --config infra/ngrok_git_authtoken.yml,infra/ngrok_git.yml start app > /dev/null 2>&1 &

# start
npm start portrait
