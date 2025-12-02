#!/bin/bash

set -e

echo "Starting Hardhat node..."
# Launch node in background
npx hardhat node --hostname 0.0.0.0 > /app/hardhat.log 2>&1 &

# Wait for Hardhat RPC to become available
echo "Waiting for node to be ready..."
sleep 5

# Deploy contract
echo "Deploying contracts..."
npx hardhat run scripts/deploy.js --network localhost

echo "Blockchain node is running..."

# Keep container alive
tail -f /dev/null
