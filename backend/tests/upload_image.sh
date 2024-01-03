#!/bin/bash

# Requires two command-line arguments to function, the auth token and the owner_id (cat profile id).


if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <token>"
    exit 1
fi

TOKEN="$1"
OWNER_ID="$2"

curl -X 'POST' \
  "http://0.0.0.0:8080/pictures/$OWNER_ID" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@./test_images/test.jpeg'

