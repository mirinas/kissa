#!/bin/bash

# Registers a new user

#curl -X POST http://0.0.0.0:8080/profiles/register \
#     -H "Content-Type: application/json" \
#     -d '{
#	    "email" : "test@example.com",
#	    "dob" : "30/05/2003",
#        "password": "newpassword",
#	    "gender" : "male",
#	    "name" : "test",
#	    "surname" : "Nicolisin",
#	    "bio" : "I want to find love",
#	    "location" : "51.50722, -0.12750",
#	    "profile_pic_url" : "",
#	    "cat" : {
#	    	"name" : "Fluffy",
#	    	"age" : 10,
#	    	"breed" : "N/A",
#	    	"sex" : false,
#	    	"bio" : "He loves to hunt",
#	    	"image_ids" : [ ]
#	    },
#	    "id" : "",
#	    "hashed_password" : "",
#	    "matches" : [ ],
#	    "matches_allowed" : 3,
#	    "selections" : [ ],
#	    "potentials" : [ ],
#	    "search_radius" : 999
#}'

!/bin/bash

# Registers a new user

curl -X POST http://localhost:8000/profiles/register \
     -H "Content-Type: application/json" \
     -d '{
	    "email" : "test2@example.com",
	    "dob" : "30/05/2003",
	    "gender" : "male",
	    "name" : "test",
	    "surname" : "Nicolisin",
	    "bio" : "I want to find love",
	    "location" : "51.50722, -0.12750",
	    "profile_pic_url" : "",
	    "cat" : {
	    	"name" : "Fluffy",
	    	"age" : 10,
	    	"breed" : "N/A",
	    	"sex" : false,
	    	"bio" : "He loves to hunt",
	    	"image_ids" : [ ]
	    },
        "password": "newpassword"
}'