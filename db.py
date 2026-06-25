from pathlib import Path
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker


# Path to the SQLite file created for DBeaver
DB_PATH = Path(__file__).resolve().parent / "dbeaver.db"

if not DB_PATH.exists():
    print(f"Aviso: arquivo de banco não encontrado: {DB_PATH}")

# SQLAlchemy URL (absolute path) - works on Windows
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH.as_posix()}"

# For SQLite, set check_same_thread to False when using sessions across threads
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_session():
    """Return a new SQLAlchemy session."""
    return SessionLocal()


def test_connection():
    """Prints available tables to verify connection."""
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print("Conectado ao banco:", DB_PATH)
    print("Tabelas encontradas:", tables)


if __name__ == "__main__":
    test_connection()
