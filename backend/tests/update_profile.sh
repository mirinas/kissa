#!/bin/bash

# Requires two command-line arguments: the auth token and the profile id
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <token> <profile_id>"
    exit 1
fi

TOKEN="$1"
PROFILE_ID="$2"

URL="http://localhost:8000/profiles/$PROFILE_ID"

# Modify the fields for the entry to patch

# For example: 
# UPDATE_DATA='{"bio": "Updated bio content"}'

UPDATE_DATA='{"bio": "NEW BIO"}'

curl -X 'PATCH' \
  "$URL" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d "$UPDATE_DATA"
