#!/bin/bash
ngrok --config infra/ngrok_git_authtoken.yml,infra/ngrok_git.yml start app > /dev/null 2>&1 &
npm start
