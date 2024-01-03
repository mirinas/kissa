#!/bin/bash

# Requires two command-line arguments to function: the image ID and the authentication token.
# Deletes an image from the cat profile

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <token> <image_id>"
    exit 1
fi

TOKEN="$1"
IMG_ID="$2"

curl -X 'DELETE' \
  "http://0.0.0.0:8080/pictures/$IMG_ID" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $TOKEN"
