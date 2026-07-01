from sqlalchemy.orm import Session

from models import Psicologo


class PsicologoRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, psicologo: Psicologo):

        self.db.add(psicologo)
        self.db.commit()
        self.db.refresh(psicologo)

        return psicologo

    def get_all(self):

        return self.db.query(Psicologo).order_by(Psicologo.nome).all()

    def get_all_ativos(self):

        return (
            self.db.query(Psicologo)
            .filter(Psicologo.ativo)
            .order_by(Psicologo.nome)
            .all()
        )

    def get_by_id(self, psicologo_id: int):

        return self.db.query(Psicologo).filter(Psicologo.id == psicologo_id).first()

    def get_by_nome(self, nome: str):

        return self.db.query(Psicologo).filter(Psicologo.nome.ilike(f"%{nome}%")).all()

    def update(self):

        self.db.commit()

    def delete(self, psicologo):

        self.db.delete(psicologo)
        self.db.commit()
