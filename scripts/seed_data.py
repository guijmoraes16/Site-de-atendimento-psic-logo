import sys
from datetime import date, time
from pathlib import Path

# Ensure project root is on sys.path so imports work when script is executed from /scripts
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from db import get_session, engine
import models


def seed():
    session = get_session()
    try:
        services = [
            models.Servico(nome='Terapia Individual', descricao='Sessões personalizadas para ansiedade, depressão e estresse.', valor=120.00, duracao=50, modalidade='Presencial/Online', ativo=True),
            models.Servico(nome='Terapia de Casal', descricao='Atendimento para casais que buscam melhorar a comunicação.', valor=180.00, duracao=60, modalidade='Presencial/Online', ativo=True),
            models.Servico(nome='Atendimento Online', descricao='Consultas via videochamada com total comodidade.', valor=100.00, duracao=50, modalidade='Online', ativo=True),
            models.Servico(nome='Orientação Psicológica', descricao='Apoio breve para crises, dúvidas ou decisões importantes.', valor=80.00, duracao=45, modalidade='Presencial/Online', ativo=True),
        ]
        for service in services:
            if not session.query(models.Servico).filter_by(nome=service.nome).first():
                session.add(service)

        psicologos = [
            models.Psicologo(nome='Dra. Ana Silva', titulo='Psicóloga Clínica', bio='Atende pessoas com ansiedade, depressão e transtornos de humor.', foto='ana.jpg', ativo=True),
            models.Psicologo(nome='Dr. Carlos Souza', titulo='Psicólogo Especialista em Terapia de Casal', bio='Ajuda casais a construir comunicação mais saudável.', foto='carlos.jpg', ativo=True),
            models.Psicologo(nome='Dra. Juliana Costa', titulo='Psicóloga de Atendimento Online', bio='Atendimento remoto com foco em autoconhecimento e equilíbrio.', foto='juliana.jpg', ativo=True),
            models.Psicologo(nome='Dra. Marina Oliveira', titulo='Psicóloga com foco em Orientação Psicológica', bio='Oferece suporte para tomada de decisões e crises emocionais.', foto='marina.jpg', ativo=True),
        ]
        for psicologo in psicologos:
            if not session.query(models.Psicologo).filter_by(nome=psicologo.nome).first():
                session.add(psicologo)

        if not session.query(models.Admin).filter_by(email='admin@clinicaequilibrio.com').first():
            admin = models.Admin(nome='Administrador', email='admin@clinicaequilibrio.com', senha='admin123')
            session.add(admin)

        available_times = [
            models.HorarioDisponivel(data=date(2026, 6, 26), hora=time(9, 0), disponivel=True),
            models.HorarioDisponivel(data=date(2026, 6, 26), hora=time(10, 0), disponivel=True),
            models.HorarioDisponivel(data=date(2026, 6, 27), hora=time(14, 0), disponivel=True),
        ]
        for slot in available_times:
            if not session.query(models.HorarioDisponivel).filter_by(data=slot.data, hora=slot.hora).first():
                session.add(slot)

        session.commit()
        print('Seed completed')
    except Exception as e:
        session.rollback()
        print('Seed error:', e)
    finally:
        session.close()


if __name__ == '__main__':
    models.Base.metadata.create_all(bind=engine)
    seed()
