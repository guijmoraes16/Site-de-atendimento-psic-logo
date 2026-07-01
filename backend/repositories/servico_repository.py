from sqlalchemy.orm import Session

from models.servico import Servico


class ServicoRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, servico: Servico):
        self.db.add(servico)
        self.db.commit()
        self.db.refresh(servico)
        return servico

    def get_all(self):
        return self.db.query(Servico).order_by(Servico.nome).all()

    def get_all_ativos(self):
        return self.db.query(Servico).filter(Servico.ativo).order_by(Servico.nome).all()

    def get_by_id(self, servico_id: int):
        return self.db.query(Servico).filter(Servico.id == servico_id).first()

    def get_by_nome(self, nome: str):
        return self.db.query(Servico).filter(Servico.nome.ilike(f"%{nome}%")).all()

    def update(self):
        self.db.commit()

    def delete(self, servico):
        self.db.delete(servico)
        self.db.commit()
