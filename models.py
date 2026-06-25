from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Date,
    Time,
    DateTime,
    ForeignKey,
    Numeric,
    Text,
)
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.types import JSON

Base = declarative_base()


class HealthPlan(Base):
    __tablename__ = "health_plans"

    id = Column(Integer, primary_key=True)
    provider = Column(String(120), nullable=False)
    plan_type = Column(String(80))
    coverage_level = Column(String(120))
    valid_until = Column(String(30))
    policy_number = Column(String(80))
    holder_name = Column(String(120))

    def __repr__(self):
        return f"<HealthPlan(id={self.id}, provider={self.provider})>"


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True)
    nome = Column(String(120), nullable=False)
    email = Column(String(200))
    telefone = Column(String(40))
    data_nascimento = Column(String(30))
    sexo = Column(String(30))
    servico_preferido = Column(String(120))
    ultima_consulta = Column(String(30))
    health_plan_id = Column(Integer, ForeignKey("health_plans.id"), nullable=True)

    health_plan = relationship("HealthPlan", backref="patients")
    appointments = relationship("Appointment", back_populates="patient")
    payments = relationship("Payment", back_populates="patient")

    def __repr__(self):
        return f"<Patient(id={self.id}, nome={self.nome})>"


class Service(Base):
    __tablename__ = "services"

    key = Column(String(80), primary_key=True)
    label = Column(String(120), nullable=False)
    price = Column(String(40))
    active = Column(Boolean, default=True)

    def __repr__(self):
        return f"<Service(key={self.key}, label={self.label})>"


class StaffMember(Base):
    __tablename__ = "staff_members"

    id = Column(Integer, primary_key=True)
    email = Column(String(200), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    name = Column(String(120))
    role = Column(String(60))

    psychologist_profile = relationship("PsychologistProfile", uselist=False, back_populates="staff")

    def __repr__(self):
        return f"<StaffMember(id={self.id}, email={self.email})>"


class PsychologistProfile(Base):
    __tablename__ = "psychologist_profiles"

    id = Column(Integer, primary_key=True)
    staff_id = Column(Integer, ForeignKey("staff_members.id"), nullable=True)
    name = Column(String(120))
    title = Column(String(120))
    crp = Column(String(60))
    image = Column(String(255))
    bio = Column(Text)
    education = Column(JSON, default=list)
    specializations = Column(JSON, default=list)
    experience = Column(JSON, default=list)
    approaches = Column(JSON, default=list)

    staff = relationship("StaffMember", back_populates="psychologist_profile")

    def __repr__(self):
        return f"<PsychologistProfile(id={self.id}, name={self.name})>"


class AvailableTime(Base):
    __tablename__ = "available_times"

    id = Column(Integer, primary_key=True)
    date = Column(String(30), nullable=False)
    times = Column(JSON, default=list)  # list of time strings

    def __repr__(self):
        return f"<AvailableTime(date={self.date})>"


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True)
    nome = Column(String(120), nullable=False)
    email = Column(String(200))
    telefone = Column(String(40))
    servico = Column(String(120))
    data = Column(String(30))
    hora = Column(String(30))
    mensagem = Column(Text)
    status = Column(String(30), default="pending")

    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)
    patient = relationship("Patient", back_populates="appointments")
    payment = relationship("Payment", uselist=False, back_populates="appointment")

    def __repr__(self):
        return f"<Appointment(id={self.id}, nome={self.nome}, data={self.data}, hora={self.hora})>"


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id"), nullable=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)
    amount = Column(String(40))
    method = Column(String(30))
    status = Column(String(30), default="pending")
    date = Column(String(30))
    insurance_used = Column(Boolean, default=False)
    health_plan_id = Column(Integer, ForeignKey("health_plans.id"), nullable=True)

    appointment = relationship("Appointment", back_populates="payment")
    patient = relationship("Patient", back_populates="payments")
    health_plan = relationship("HealthPlan")

    def __repr__(self):
        return f"<Payment(id={self.id}, amount={self.amount}, status={self.status})>"



if __name__ == "__main__":
    from sqlalchemy import create_engine

    engine = create_engine("sqlite:///app.db", echo=True)
    Base.metadata.create_all(engine)
    print("Banco de dados (SQLite) criado: app.db")
