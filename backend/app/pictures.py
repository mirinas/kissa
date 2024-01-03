"""
Pictures module.

When an image is uploaded, stores the file in GridFS, 
and then updates the corresponding cat profile by adding the new file ID.

All these functions are authorised-only operations
"""

from fastapi import APIRouter, HTTPException, File, UploadFile, status, Depends, Query
from database import Database
from models import CatProfile, UserProfile
from auth import get_current_user
import base64

router = APIRouter(prefix="/pictures", tags=['pictures'])
user_db = Database()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def upload_picture(file: UploadFile = File(...), is_profile_pic: bool = Query(False), current_user: UserProfile = Depends(get_current_user)):
    """Store the image in GridFS and update the user/cat profile according to is_profile_pic bool argument provided"""

    contents = await file.read()
    file_id = user_db.upload_file(contents, current_user.oid)

    if not file_id:
        raise HTTPException(status_code=500, detail="Failed to upload file")

    if is_profile_pic:
        # Update the user's profile picture ID
        updated_user = user_db.update_user_profile_pic(current_user.oid, file_id)
        if not updated_user:
            raise HTTPException(status_code=500, detail="Failed to update user profile")
    else:
        # Add cat's image to profile 
        updated_cat = user_db.update_cat_profile_images(current_user.oid, file_id)
        if not updated_cat:
            raise HTTPException(status_code=500, detail="Failed to update cat profile")

    return {"file_id": str(file_id)}


@router.get("/{pid}", status_code=status.HTTP_200_OK)
async def get_picture(pid: str, current_user: UserProfile = Depends(get_current_user)):
    """Returns a base64 image from the database"""

    file = user_db.get_file(pid)

    if file is None:
        raise HTTPException(status_code=404, detail="File not found")

    owner_id = file.metadata['owner_id']

    # we only allow to access file only if the owner appears to be the caller or in the caller's list of potentials
    if owner_id != current_user.oid:
        res = list(filter(lambda x: x.owner_id == owner_id, current_user.potentials))
        if len(res) == 0:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not allowed to access this file")

    return base64.b64encode(file.read()).decode()


@router.delete("/{pid}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_picture(pid: str, current_user: UserProfile = Depends(get_current_user)):
    file = user_db.get_file(pid)

    if file is None:
        raise HTTPException(status_code=404, detail="File not found")

    owner_id = file.metadata['owner_id']
    if current_user.oid != owner_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not allowed to delete this file")

    deletion_success = user_db.delete_file(pid)

    if not deletion_success:
        raise HTTPException(status_code=400, detail="Error deleting file")
    return {"message": "File deleted successfully"}
