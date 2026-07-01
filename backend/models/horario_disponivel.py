from core.database import Base

from sqlalchemy import (
    Column,
    Integer,
    Date,
    Time,
    Boolean,
)


class HorarioDisponivel(Base):
    __tablename__ = "horarios_disponiveis"

    id = Column(Integer, primary_key=True, index=True)
    data = Column(Date, nullable=False)
    hora = Column(Time, nullable=False)
    disponivel = Column(Boolean, default=True)
