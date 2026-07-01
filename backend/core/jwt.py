from datetime import datetime, timedelta
from jose import jwt

from core.config import settings


def criar_token(dados: dict):

    payload = dados.copy()

    exp = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    payload.update({"exp": exp})

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )
