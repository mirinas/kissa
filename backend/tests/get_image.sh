#!/bin/bash

# Requires two command-line arguments to function, the authentication token and image id.
# Gets and image based on the image id

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <token> <img_id>"
    exit 1
fi

TOKEN="$1"
IMG_ID="$2"

curl -X 'GET' \
  "http://0.0.0.0:8080/pictures/$IMG_ID" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $TOKEN"
