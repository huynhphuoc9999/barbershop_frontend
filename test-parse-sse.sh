#!/bin/bash

# Simulate what frontend does - parse SSE stream
echo "=== Simulating Frontend SSE Parsing ==="
echo ""

curl -s 'https://barbershop-backend-yn3c.onrender.com/api/chat/stream' \
  -H 'content-type: application/json' \
  --data-raw '{"message":"xin chào","sessionId":null}' \
  --no-buffer | while IFS= read -r line; do
    if [[ "$line" == data:* ]]; then
        # Extract content after "data:"
        content="${line:5}"
        if [[ "$content" == "[DONE]" ]]; then
            echo ">>> Stream complete"
            break
        else
            # Print with quotes to show spaces
            echo "Chunk: '$content'"
        fi
    fi
done

echo ""
echo "=== Test Complete ==="
