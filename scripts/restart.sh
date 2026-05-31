#!/bin/bash
set -e

cd /home/arushserver/repotimemachine

# Kill old server
fuser -k 3000/tcp 2>/dev/null || true
sleep 3

# Start server in background
npm run start > /tmp/repotimemachine.log 2>&1 &
SERVER_PID=$!
echo "Server started with PID $SERVER_PID"

# Wait for server
for i in $(seq 1 20); do
  if curl -s -o /dev/null -w "%{http_code}" http://192.168.1.204:3000 2>/dev/null | grep -q "200"; then
    echo "Server ready!"
    break
  fi
  sleep 1
done

# Quick API test
sleep 5
curl -s -X POST http://192.168.1.204:3000/api/documentary \
  -H "Content-Type: application/json" \
  -d '{"owner":"torvalds","repo":"linux"}' | python3 -c "
import sys, json
d = json.load(sys.stdin)
doc = d.get('documentary', '')
print(f'Response length: {len(doc)} chars')
print('---FIRST 600---')
print(doc[:600])
" 2>&1

echo ""
echo "Server PID: $SERVER_PID"
echo "Check log: tail -f /tmp/repotimemachine.log"
