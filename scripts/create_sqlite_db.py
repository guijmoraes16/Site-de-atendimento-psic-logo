import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SQL_FILE = ROOT / "dbeaver_tables.txt"
DB_FILE = ROOT / "dbeaver.db"

def main():
    if not SQL_FILE.exists():
        print(f"Arquivo SQL não encontrado: {SQL_FILE}")
        return

    sql = SQL_FILE.read_text(encoding="utf-8")

    # Create / overwrite database
    conn = sqlite3.connect(str(DB_FILE))
    try:
        cur = conn.cursor()
        cur.executescript(sql)
        conn.commit()
        print(f"Banco criado com sucesso: {DB_FILE}")
    except Exception as e:
        print("Erro ao executar script SQL:", e)
    finally:
        conn.close()

if __name__ == "__main__":
    main()
