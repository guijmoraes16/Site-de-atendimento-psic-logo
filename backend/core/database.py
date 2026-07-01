from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://postgres:1234@localhost:5432/agendamentos"

motor = create_engine(DATABASE_URL, pool_pre_ping=True)

SessaoLocal = sessionmaker(autocommit=False, autoflush=False, bind=motor)

Base = declarative_base()


def get_banco():
    banco = SessaoLocal()
    try:
        yield banco
    finally:
        banco.close()
