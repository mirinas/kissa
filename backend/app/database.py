"""
Database operations module.

This module provides functions to interact with the user database.
"""

from pymongo import MongoClient
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

    def get_user_by_username(self, username: str):
        user = self.collection.find_one({"username": username})
        if user:
            return user 
        return None

    # function if we decide to change the authentication method later 
    def get_user_by_id(self, id: str):
        user = self.collection.find_one({"id": id})
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
            file = self.fs.get(id)
            return file.read()
        except gridfs.errors.NoFile:
            return None

    def delete_file(self, id):
        try:
            self.fs.delete(id)
        except gridfs.errors.NoFile:
            return None
