"""
Database operations module.

This module provides functions to interact with the user database.
"""
from typing import Optional

from pymongo import MongoClient
from bson import ObjectId
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
import gridfs


def documentize(d: dict) -> dict:
    d['_id'] = ObjectId(d.pop('oid'))
    return d


def pythonize(d: dict) -> dict:
    d['oid'] = str(d.pop('_id'))
    return d


class UserDatabase:
    # Uses azures key vault
    def __init__(self):
        #KEY_VAULT_URL = "https://kissa-vault.vault.azure.net/"
        #credential = DefaultAzureCredential()
        #client = SecretClient(vault_url=KEY_VAULT_URL, credential=credential)

        #COSMOS_DB_URI = client.get_secret("COSMOS-DB-URI")
        #COSMOS_DB_NAME = client.get_secret("COSMOS-DB-NAME")
        #COSMOS_DB_COLLECTION = client.get_secret("COSMOS-DB-COLLECTION")

        COSMOS_DB_URI = "mongodb://kissa-db-dpwvhfkg:7i661s7SDxYdbRP3PTGLQEaCUGiaQea0zyqvrNelWu1ZBJByuROpU5D6AbUUcIYZYkl7NaG1IE7VACDbloh7Iw==@kissa-db-dpwvhfkg.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@kissa-db-dpwvhfkg@"
        COSMOS_DB_NAME = "kissa-db"
        COSMOS_DB_PROFILE_COLLECTION = "kissa-db-profile-collection"
        COSMOS_DB_MATCH_COLLECTION = "kissa-db-match-collection"
        
        client = MongoClient(COSMOS_DB_URI)
        self.db = client[COSMOS_DB_NAME]
        self.profile_collection = self.db[COSMOS_DB_PROFILE_COLLECTION]
        self.match_collection = self.db[COSMOS_DB_MATCH_COLLECTION]

        self.fs = gridfs.GridFS(self.db)   # initialise gridFS

    def get_user_by_email(self, email: str):
        user = self.profile_collection.find_one({"email": email})
        if user:
            user = pythonize(dict(user))
            return user 
        return None

    def get_user_by_id(self, user_id: str):
        if not ObjectId.is_valid(user_id):
            print('User id is not valid', user_id)
            return None
        oid = ObjectId(user_id)
        user = self.profile_collection.find_one({'_id': oid})
        if user:
            user = pythonize(dict(user))
            return user
        return None

    def create_user(self, user_dict) -> Optional[str]:
        try:
            user_dict = documentize(user_dict)
            user_dict.pop('_id')
            return str(self.profile_collection.insert_one(user_dict).inserted_id)
        except Exception as e:
            print("Error registering user: " + str(e))
            return None
        
    def upload_file(self, file_data, owner_id):
        # Stores the file in GridFS and is represented as a string id
        # GraphFS stores owner_id using the 'metadata' tag
        file_id = self.fs.put(file_data, metadata={'owner_id': owner_id})
        return file_id

    def get_file(self, _id):
        try:
            file_id = ObjectId(_id)
            file = self.fs.get(file_id)
            return file
        except gridfs.errors.NoFile:
            return None

    def delete_file(self, _id):
        try:
            # Remove image from database using its id
            file_id = ObjectId(_id)
            self.fs.delete(file_id)

            # Remove database entry
            self.profile_collection.update_many(
                {"cat.image_ids": file_id},
                {"$pull": {"cat_profile.image_ids": file_id}}
            )

            return True
        except gridfs.errors.NoFile:
            return False 
        except Exception as e:
            print("Error when deleting file: " + str(e))
            return False

    # Only use for testing purposes
    def clear_database(self):
        print('Clearing database...')
        print(f"Profiles entries: {len(list(self.profile_collection.find()))}")
        print(f"Match entries: {len(list(self.match_collection.find()))}")
        print(f"Files entries: {len(list(self.fs.find()))}")

        for entry in self.profile_collection.find():
            self.profile_collection.delete_one(entry)

        for entry in self.match_collection.find():
            self.match_collection.delete_one(entry)

        for file in self.fs.find():
            self.fs.delete(file._id)

        print('Database cleared.')
        print(f"Profiles entries: {len(list(self.profile_collection.find()))}")
        print(f"Match entries: {len(list(self.match_collection.find()))}")
        print(f"Files entries: {len(list(self.fs.find()))}")


if __name__ == "__main__":
    db = UserDatabase()
    db.clear_database()
