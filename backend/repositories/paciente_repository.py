from sqlalchemy.orm import Session

from models.paciente import Paciente


class PacienteRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, paciente: Paciente):
        self.db.add(paciente)
        self.db.commit()
        self.db.refresh(paciente)
        return paciente

    def get_all(self):
        return self.db.query(Paciente).order_by(Paciente.nome).all()

    def get_by_id(self, paciente_id: int):
        return self.db.query(Paciente).filter(Paciente.id == paciente_id).first()

    def get_by_email(self, email: str):
        return self.db.query(Paciente).filter(Paciente.email == email).first()

    def get_by_nome(self, nome: str):
        return self.db.query(Paciente).filter(Paciente.nome.ilike(f"%{nome}%")).all()

    def get_by_cpf(self, cpf: str):
        return self.db.query(Paciente).filter(Paciente.cpf == cpf).first()

    def update(self):
        self.db.commit()

    def delete(self, paciente):
        self.db.delete(paciente)
        self.db.commit()

    def alternative_get_by_nome(self, nome: str):
        pacientes = (
            self.db.query(
                Paciente.id,
                Paciente.nome,
                Paciente.telefone,
            )
            .filter(Paciente.nome.ilike(f"%{nome}%"))
            .all()
        )

        return [
            {
                "id": p.id,
                "nome": p.nome,
                "telefone": p.telefone,
            }
            for p in pacientes
        ]
