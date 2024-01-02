"""
Profile matching module.

"""

from fastapi import APIRouter, HTTPException, File, UploadFile, status
from database import UserDatabase
from models import Match, Message, MeetingConfirmation
from typing import Any

router = APIRouter(prefix="/match")


@router.get("/{mid}", status_code=status.HTTP_200_OK, response_model=Match, response_model_exclude_unset=True)
def get_match(mid: int) -> Any:
    m = Match()
    m.id = "12"
    m.user_1 = 'u1'
    m.user_2 = 'u2'
    m.meeting_confirmation = list()
    m.messages = list()
    return m


@router.post("/{mid}/message", status_code=status.HTTP_201_CREATED)
def post_message(mid: int, msg: Message):
    pass


@router.post("/{mid}/confirm", status_code=status.HTTP_200_OK)
def confirm_meeting(mid: int, confirmation: MeetingConfirmation):
    pass
