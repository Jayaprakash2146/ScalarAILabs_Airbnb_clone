"""Image upload endpoint.

Bonus feature: image upload. Files are persisted to the local ``uploads/``
directory and served back as static files, which stands in for a cloud bucket
(S3/Cloudinary). Swapping in a cloud provider only requires replacing the
``_persist`` helper — the API contract stays identical.
"""
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile

from .. import models
from ..auth import get_current_user

router = APIRouter(prefix="/api/uploads", tags=["uploads"])

MAX_BYTES = 5 * 1024 * 1024  # 5 MB
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}

UPLOAD_DIR = Path("uploads")


@router.post("")
async def upload_image(
    request: Request,
    file: UploadFile,
    _user: models.User = Depends(get_current_user),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Only JPEG, PNG, WebP or GIF images are allowed")

    payload = await file.read()
    if len(payload) > MAX_BYTES:
        raise HTTPException(400, "Image must be 5 MB or smaller")

    UPLOAD_DIR.mkdir(exist_ok=True)
    ext = Path(file.filename or "photo.jpg").suffix.lower() or ".jpg"
    name = f"{uuid.uuid4().hex}{ext}"
    (UPLOAD_DIR / name).write_bytes(payload)

    url = str(request.base_url).rstrip("/") + f"/uploads/{name}"
    return {"url": url, "filename": name, "size_bytes": len(payload)}
