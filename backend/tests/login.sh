#!/bin/bash

# Requires two command-line arguments to function, the email and password.

# Example credentials:
# Email: USERNAME@example.com
# Password: mypassword

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <username> <password>"
    exit 1
fi

USERNAME="$1"
PASSWORD="$2"

curl -X POST http://0.0.0.0:8080/profiles/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=$USERNAME&password=$PASSWORD"
