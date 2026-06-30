from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_banco
from schema.appointment import AppointmentCreate
from models.agendamento import Agendamento
from models.paciente import Paciente
from models.servico import Servico

roteador = APIRouter(
    prefix="/appointments",
    tags=["Appointments"],
)


@roteador.post("", status_code=status.HTTP_201_CREATED)
def criar_agendamento(dados: AppointmentCreate, db: Session = Depends(get_banco)):
    paciente = db.query(Paciente).filter(Paciente.email == dados.email).first()
    if not paciente:
        paciente = Paciente(
            nome=dados.nome,
            email=dados.email,
            telefone=dados.telefone,
        )
        db.add(paciente)
        db.commit()
        db.refresh(paciente)
    else:
        if paciente.telefone != dados.telefone or paciente.nome != dados.nome:
            paciente.telefone = dados.telefone
            paciente.nome = dados.nome
            db.commit()
            db.refresh(paciente)

    servico = db.query(Servico).filter(Servico.nome == dados.servico).first()
    if not servico:
        servico = Servico(
            nome=dados.servico,
            descricao="Serviço criado automaticamente",
            valor=0,
            duracao=0,
            modalidade="Desconhecida",
            ativo=True,
        )
        db.add(servico)
        db.commit()
        db.refresh(servico)

    agendamento = Agendamento(
        paciente_id=paciente.id,
        psicologo_id=None,
        servico_id=servico.id,
        data=dados.data,
        hora=dados.hora,
        mensagem=dados.mensagem,
        status=dados.status or "Pendente",
    )
    db.add(agendamento)
    db.commit()
    db.refresh(agendamento)

    return {
        "success": True,
        "id": agendamento.id,
        "paciente_id": paciente.id,
        "servico_id": servico.id,
        "data": str(agendamento.data),
        "hora": str(agendamento.hora),
        "status": agendamento.status,
    }
