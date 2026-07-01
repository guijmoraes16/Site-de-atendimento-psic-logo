from core.database import Base

from sqlalchemy import (
    Column,
    Integer,
    Date,
    Time,
    Boolean,
    ForeignKey,
)

from sqlalchemy.orm import relationship


class HorarioDisponivel(Base):
    __tablename__ = "horarios_disponiveis"

    id = Column(Integer, primary_key=True, index=True)

    psicologo_id = Column(
        Integer,
        ForeignKey("psicologos.id"),
        nullable=False,
    )

    data = Column(Date, nullable=False)

    hora = Column(Time, nullable=False)

    disponivel = Column(Boolean, default=True)

    psicologo = relationship(
        "Psicologo",
        back_populates="horarios",
    )
