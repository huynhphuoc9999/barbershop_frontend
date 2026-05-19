#!/bin/bash

echo "=== Testing Chatbot Stream API ==="
echo ""

curl 'https://barbershop-backend-yn3c.onrender.com/api/chat/stream' \
  -H 'accept: */*' \
  -H 'accept-language: vi,en;q=0.9,en-US;q=0.8' \
  -H 'content-type: application/json' \
  -H 'dnt: 1' \
  -H 'origin: https://barbershopbpteam.vercel.app' \
  -H 'priority: u=1, i' \
  -H 'referer: https://barbershopbpteam.vercel.app/' \
  -H 'sec-ch-ua: "Chromium";v="148", "Microsoft Edge";v="148", "Not/A)Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: cross-site' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0' \
  --data-raw '{"message":"xin chào","sessionId":null}' \
  --no-buffer

echo ""
echo "=== Test Complete ==="
