"""
Database operations module.

This module provides functions to interact with the user database.
"""

from pymongo import MongoClient
from bson import ObjectId
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
import gridfs

class UserDatabase:
    # Uses azures key vault
    def __init__(self):
        KEY_VAULT_URL = "https://kissa-vault.vault.azure.net/"
        credential = DefaultAzureCredential()
        #client = SecretClient(vault_url=KEY_VAULT_URL, credential=credential)

        #COSMOS_DB_URI = client.get_secret("COSMOS-DB-URI")
        #COSMOS_DB_NAME = client.get_secret("COSMOS-DB-NAME")
        #COSMOS_DB_COLLECTION = client.get_secret("COSMOS-DB-COLLECTION")

        COSMOS_DB_URI = "mongodb://kissa-db-dpwvhfkg:7i661s7SDxYdbRP3PTGLQEaCUGiaQea0zyqvrNelWu1ZBJByuROpU5D6AbUUcIYZYkl7NaG1IE7VACDbloh7Iw==@kissa-db-dpwvhfkg.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@kissa-db-dpwvhfkg@"
        COSMOS_DB_NAME = "kissa-db"
        COSMOS_DB_COLLECTION = "kissa-db-collection"
        
        client = MongoClient(COSMOS_DB_URI)
        self.db = client[COSMOS_DB_NAME]
        self.collection = self.db[COSMOS_DB_COLLECTION]

        self.fs = gridfs.GridFS(self.db) #initialise gridFS

    def get_user_by_email(self, email: str):
        user = self.collection.find_one({"email": email})
        if user:
            return user 
        return None

    def create_user(self, user_dict) -> bool:
        try:
            self.collection.insert_one(user_dict)
            return True
        except Exception as e:
            print("Error registering user: " + str(e))
            return False
        
    # Stores the file in GridFS and is represented as a string id
    def upload_file(self, file_data):
        file_id = self.fs.put(file_data)
        return file_id

    def get_file(self, id):
        try:
            file_id = ObjectId(id)
            file = self.fs.get(file_id)
            return file.read()
        except gridfs.errors.NoFile:
            return None

    def delete_file(self, id):
        try:
            # Remove image from database
            file_id = ObjectId(id)
            self.fs.delete(file_id)

            # Remove database entry
            self.collection.update_many(
                {"cat_profile.image_ids": file_id},
                {"$pull": {"cat_profile.image_ids": file_id}}
            )

            return True
        except gridfs.errors.NoFile: # if file not found
            return False 
        except Exception as e: # if error occurred
            print("Error deleting file: " + str(e))
            return False  

    def update_cat_profile_with_image(self, cat_profile_id, image_id):
       try:
           self.collection.update_one(
               {"cat_profile.owner_id": cat_profile_id},
               {"$push": {"cat_profile.image_ids": image_id}}
           )
           return True
       except Exception as e:
           print(f"Error updating cat profile: {e}")
           return False
