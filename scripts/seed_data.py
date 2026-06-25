import sys
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
        # Add services
        services = [
            models.Service(key='individual', label='Terapia Individual', price='R$ 120', active=True),
            models.Service(key='casal', label='Terapia de Casal', price='R$ 180', active=True),
            models.Service(key='online', label='Atendimento Online', price='R$ 100', active=True),
            models.Service(key='orientacao', label='Orientação Psicológica', price='R$ 80', active=True),
        ]
        for s in services:
            if not session.get(models.Service, s.key):
                session.add(s)

        # Add a health plan
        if not session.query(models.HealthPlan).filter_by(provider='Unimed').first():
            hp = models.HealthPlan(provider='Unimed', plan_type='Familiar', coverage_level='Consultas e Terapia', valid_until='2027-06-30', policy_number='UND987654321', holder_name='Pedro Oliveira')
            session.add(hp)

        # Add a sample patient
        if not session.query(models.Patient).filter_by(email='maria.souza@gmail.com').first():
            p = models.Patient(nome='Maria de Souza', email='maria.souza@gmail.com', telefone='(11) 91234-5678', data_nascimento='1988-05-14', sexo='Feminino', servico_preferido='Terapia Individual')
            session.add(p)

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
