#!/bin/bash

# Requires a single command-line argument to function, the authentication token.
# Deletes as image from the cat profile

# Check if a token argument is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <token>"
    exit 1
fi

# Assign the first argument to a variable
TOKEN="$1"

curl -X 'DELETE' \
  "http://0.0.0.0:8080/pictures/$TOKEN" \
  -H 'accept: application/json'
