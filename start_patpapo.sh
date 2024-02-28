#!/bin/bash
ngrok --config infra/ngrok_poll_authtoken.yml,infra/ngrok_poll.yml start app > /dev/null 2>&1 &
npm start patpapo
