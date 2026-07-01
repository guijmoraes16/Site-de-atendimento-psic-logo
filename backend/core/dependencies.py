from fastapi import Depends
from sqlalchemy.orm import Session

from core.database import get_banco

from repositories.paciente_repository import PacienteRepository
from repositories.psicologo_repository import PsicologoRepository

from services.paciente_service import PacienteService
from services.psicologo_service import PsicologoService


def get_paciente_service(
    db: Session = Depends(get_banco),
):

    return PacienteService(PacienteRepository(db))


def get_psicologo_service(
    db: Session = Depends(get_banco),
):

    return PsicologoService(PsicologoRepository(db))
