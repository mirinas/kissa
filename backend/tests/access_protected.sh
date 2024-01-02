#!/bin/bash

# Requires a single command-line argument to function, the authentication token.
# Returns information about the currently authenticated user.

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <token>"
    exit 1
fi

TOKEN="$1"

# Perform the curl request
curl -X 'GET' \
    'http://0.0.0.0:8080/users/me' \
    -H 'accept: application/json' \
    -H "Authorization: Bearer $TOKEN"

