INSERT INTO pacientes
(nome, email, telefone, cpf, data_nascimento, endereco, observacoes)
VALUES

(
'João Pedro Silva',
'joao@email.com',
'63999990001',
'11111111111',
'2000-05-15',
'Palmas - TO',
'Primeira consulta.'
),

(
'Ana Beatriz',
'ana@email.com',
'63999990002',
'22222222222',
'1998-09-22',
'Araguaína - TO',
''
),

(
'Carlos Eduardo',
'carlos@email.com',
'63999990003',
'33333333333',
'1989-11-10',
'Gurupi - TO',
'Paciente ansioso.'
),

(
'Fernanda Lima',
'fernanda@email.com',
'63999990004',
'44444444444',
'1995-07-18',
'Porto Nacional - TO',
''
),

(
'Lucas Martins',
'lucas@email.com',
'63999990005',
'55555555555',
'2001-12-02',
'Paraíso do Tocantins - TO',
'Retorno.'
);

INSERT INTO psicologos
(nome, titulo, bio, foto, ativo)
VALUES

(
'Dra. Juliana Castro',
'Psicóloga Clínica',
'Especialista em Terapia Cognitivo-Comportamental.',
'juliana.jpg',
true
),

(
'Dr. Rafael Gomes',
'Psicólogo',
'Especialista em ansiedade e depressão.',
'rafael.jpg',
true
),

(
'Dra. Camila Rocha',
'Psicóloga Infantil',
'Atendimento para crianças e adolescentes.',
'camila.jpg',
true
);

INSERT INTO servicos
(nome, descricao, valor, duracao, modalidade, ativo)
VALUES

(
'Consulta Psicológica',
'Consulta individual.',
120.00,
50,
'Presencial',
true
),

(
'Terapia Online',
'Sessão realizada por videoconferência.',
100.00,
50,
'Online',
true
),

(
'Avaliação Psicológica',
'Avaliação completa.',
250.00,
90,
'Presencial',
true
),

(
'Terapia Infantil',
'Atendimento infantil.',
150.00,
60,
'Presencial',
true
);

INSERT INTO horarios_disponiveis
(psicologo_id, data, hora, disponivel)
VALUES

(1,'2026-07-02','08:00',true),
(1,'2026-07-02','09:00',true),
(1,'2026-07-02','10:00',true),

(2,'2026-07-02','14:00',true),
(2,'2026-07-02','15:00',true),
(2,'2026-07-02','16:00',true),

(3,'2026-07-03','08:30',true),
(3,'2026-07-03','09:30',true),
(3,'2026-07-03','10:30',true);

INSERT INTO agendamentos
(
paciente_id,
psicologo_id,
servico_id,
horario_id,
mensagem,
status
)
VALUES

(
1,
1,
1,
1,
'Primeira consulta.',
'Agendado'
),

(
2,
2,
2,
4,
'Consulta online.',
'Confirmado'
),

(
3,
3,
4,
7,
'Primeira sessão.',
'Concluido'
);