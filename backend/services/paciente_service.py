from fastapi import HTTPException

from models.paciente import Paciente


class PacienteService:
    def __init__(self, repository):
        self.repository = repository

    def criar(self, dados):

        if self.repository.get_by_email(dados.email):
            raise HTTPException(status_code=400, detail="Email já cadastrado.")

        if self.repository.get_by_cpf(dados.cpf):
            raise HTTPException(status_code=400, detail="CPF já cadastrado.")

        paciente = Paciente(
            nome=dados.nome,
            email=dados.email,
            telefone=dados.telefone,
            cpf=dados.cpf,
            data_nascimento=dados.data_nascimento,
            endereco=dados.endereco,
            observacoes=dados.observacoes,
        )

        paciente = self.repository.create(paciente)

        return {
            "mensagem": "Paciente cadastrado.",
            "objeto": paciente,
        }

    def listar(self):

        return self.repository.get_all()

    def buscar(self, paciente_id):

        paciente = self.repository.get_by_id(paciente_id)

        if not paciente:
            raise HTTPException(status_code=404, detail="Paciente não encontrado.")

        return paciente

    def atualizar(self, paciente_id, dados):

        paciente = self.buscar(paciente_id)

        paciente.nome = dados.nome
        paciente.email = dados.email
        paciente.telefone = dados.telefone
        paciente.cpf = dados.cpf
        paciente.data_nascimento = dados.data_nascimento
        paciente.endereco = dados.endereco
        paciente.observacoes = dados.observacoes

        self.repository.update()

        return {
            "mensagem": "Paciente atualizado.",
            "objeto": paciente,
        }

    def excluir(self, paciente_id):

        paciente = self.buscar(paciente_id)

        self.repository.delete(paciente)

        return {"mensagem": "Paciente removido."}

    def buscar_por_nome(self, nome: str):

        pacientes = self.repository.get_by_nome(nome)

        return {
            "mensagem": "Busca realizada.",
            "total": len(pacientes),
            "objetos": pacientes,
        }

    def buscar_por_cpf(self, cpf: str):

        pacientes = self.repository.get_by_cpf(cpf)

        return {
            "mensagem": "Busca realizada.",
            "objetos": pacientes,
        }
