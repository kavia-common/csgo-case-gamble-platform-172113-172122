#!/bin/bash
cd /home/kavia/workspace/code-generation/csgo-case-gamble-platform-172113-172122/csgo_case_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

