from fastapi import Depends
from sqlalchemy.orm import Session

from core.database import get_banco

from repositories.horario_repository import HorarioRepository
from repositories.servico_repository import ServicoRepository
from repositories.usuario_repository import UsuarioRepository
from repositories.paciente_repository import PacienteRepository
from repositories.psicologo_repository import PsicologoRepository

from services.horario_service import HorarioService
from services.servico_service import ServicoService
from services.paciente_service import PacienteService
from services.psicologo_service import PsicologoService
from services.usuario_service import UsuarioSelfService


def get_servico_service(
    db: Session = Depends(get_banco),
):
    return ServicoService(ServicoRepository(db))


def get_paciente_service(
    db: Session = Depends(get_banco),
):

    return PacienteService(PacienteRepository(db))


def get_psicologo_service(
    db: Session = Depends(get_banco),
):

    return PsicologoService(PsicologoRepository(db))


def get_horario_service(
    db: Session = Depends(get_banco),
):
    return HorarioService(
        HorarioRepository(db),
        PsicologoRepository(db),
    )


def get_usuario_service(
    db: Session = Depends(get_banco),
):
    return UsuarioSelfService(UsuarioRepository(db))
