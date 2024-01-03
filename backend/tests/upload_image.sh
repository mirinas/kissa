#!/bin/bash

# Requires three command-line arguments: the auth token, a flag indicating if the image is for a user profile
# and the profile id
# user = true
# cat = false

if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <token> <is_profile_pic> <profile_id>"
    exit 1
fi

TOKEN="$1"
IS_PROFILE_PIC="$2"
PROFILE_ID="$3"

URL="http://0.0.0.0:8080/pictures/?is_profile_pic=$IS_PROFILE_PIC&cat_profile_id=$PROFILE_ID"

curl -X 'POST' \
  "$URL" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@./test_images/test.jpeg'
