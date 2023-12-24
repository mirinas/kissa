"""
Database operations module.

This module provides functions to interact with the user database.
"""

from pymongo import MongoClient
import os

COSMOS_DB_URI = os.getenv('COSMOS_DB_URI')
COSMOS_DB_NAME = os.getenv('COSMOS_DB_NAME')
COSMOS_DB_COLLECTION = os.getenv('COSMOS_DB_COLLECTION')

client = MongoClient(COSMOS_DB_URI)
db = client[COSMOS_DB_NAME]
collection = db[COSMOS_DB_COLLECTION]

def get_user(username: str, password: str):
    # TODO: Make checks, get user from database

    return True

def create_user(username: str, password: str, email: str) -> bool:
    # TODO: Make checks, add user to database

    return True
