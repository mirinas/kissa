#!/bin/bash

# Registers a new user

curl -X POST http://0.0.0.0:8080/profiles/register \
     -H "Content-Type: application/json" \
     -d '{
         "id": "",
         "username": "newuser",
         "hashed_password": "newpassword",
         "email": "newuser@example.com",
         "name": "John",
         "surname": "Doe",
         "age": 30,
         "dob": "1991-01-01",
         "gender": "male",
         "location": "52.5200, 13.4050",
         "profile_pic_url": "http://example.com/profilepic.jpg",
         "cat_profile": {
             "owner_id": "",
             "name": "Fluffy",
             "age": 5,
             "breed": "Siamese",
             "sex": true,
             "bio": "Loves to play all day",
             "image_urls": ["http://example.com/catpic.jpg"]
         }
     }'
