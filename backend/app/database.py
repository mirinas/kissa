"""
Database operations module.

This module provides functions to interact with the user database.
"""

from pymongo import MongoClient
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

class UserDatabase:
    # Uses azures key vault
    def __init__(self):
        KEY_VAULT_URL = "https://kissa-vault.vault.azure.net/"
        credential = DefaultAzureCredential()
        client = SecretClient(vault_url=KEY_VAULT_URL, credential=credential)

        COSMOS_DB_URI = client.get_secret("COSMOS-DB-URI")
        COSMOS_DB_NAME = client.get_secret("COSMOS-DB-NAME")
        COSMOS_DB_COLLECTION = client.get_secret("COSMOS-DB-COLLECTION")

        client = MongoClient(COSMOS_DB_URI)
        self.db = client[COSMOS_DB_NAME]
        self.collection = self.db[COSMOS_DB_COLLECTION]

    def get_user(self, username: str, password: str):
        user = self.collection.find_one({"username": username})
    
        return user
    
    def create_user(self, username: str, password: str, email: str) -> bool:
        try:
            self.collection.insert_one({"username": username, "password": password, "email": email})
            return True
        except Exception as e:
            print("Error registering user: " + e)
            return False
