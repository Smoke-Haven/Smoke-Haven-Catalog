#!/bin/bash
echo "🔄 Restoring all 129 vape flavors with cupboard numbers..."
node add-flavors.mjs
sleep 2
node update-cupboards.mjs
sleep 2
echo "✅ Restored!"
curl -s "https://smoke-haven-api.onrender.com/api/menu/items" | jq '.items | length' | xargs echo "Total items:"
