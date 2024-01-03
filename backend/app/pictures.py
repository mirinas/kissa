"""
Pictures module.

When an image is uploaded, stores the file in GridFS, 
and then updates the corresponding cat profile by adding the new file ID.

All these functions are authorised-only operations
"""

from fastapi import APIRouter, HTTPException, File, UploadFile, status, Depends
from database import UserDatabase
from models import CatProfile, Picture, UserInDB
from auth import get_current_user
import base64

router = APIRouter(prefix="/pictures")
user_db = UserDatabase()

@router.post("/{cat_profile_id}", status_code=status.HTTP_201_CREATED)
async def upload_picture(cat_profile_id: str, file: UploadFile = File(...), current_user: UserInDB = Depends(get_current_user)):
    owner_id = current_user.cat_profile.owner_id

    # Store the image in GridFS
    contents = await file.read()
    file_id = user_db.upload_file(contents, owner_id)

    if not file_id:
        raise HTTPException(status_code=500, detail="Failed to upload file")

    # Update cat profile with the image ID
    updated = user_db.update_cat_profile_with_image(cat_profile_id, file_id)

    if not updated:
        raise HTTPException(status_code=500, detail="Failed to update cat profile")

    return {"file_id": str(file_id)}

# Retuns a base64 image from the database
@router.get("/{pid}", status_code=status.HTTP_200_OK)
async def get_picture(pid: str, current_user: UserInDB = Depends(get_current_user)):
    file_content = user_db.get_file(pid)

    if file_content is None:
        raise HTTPException(status_code=404, detail="File not found")

    return base64.b64encode(file_content).decode()

@router.delete("/{pid}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_picture(pid: str, current_user: UserInDB = Depends(get_current_user)):
    deletion_success = user_db.delete_file(pid)

    if not deletion_success:
        raise HTTPException(status_code=404, detail="File not found")
    return {"message": "File deleted successfully"}
