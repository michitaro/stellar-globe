import secrets


def tinyid():
    return secrets.token_urlsafe(16)
