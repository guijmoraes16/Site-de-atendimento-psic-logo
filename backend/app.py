from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_session, engine
import models

app = Flask(__name__)
CORS(app)


@app.route('/appointments', methods=['POST'])
def create_appointment():
    data = request.get_json() or {}
    required = ['nome', 'email', 'telefone', 'servico', 'data', 'hora']
    for r in required:
        if r not in data:
            return jsonify({'error': f'Missing field: {r}'}), 400

    session = get_session()
    try:
        # find or create patient by email
        patient = None
        if data.get('email'):
            patient = session.query(models.Patient).filter_by(email=data['email']).first()
        if not patient:
            patient = models.Patient(nome=data.get('nome'), email=data.get('email'), telefone=data.get('telefone'))
            session.add(patient)
            session.flush()  # get id

        appt = models.Appointment(
            nome=data.get('nome'),
            email=data.get('email'),
            telefone=data.get('telefone'),
            servico=data.get('servico'),
            data=data.get('data'),
            hora=data.get('hora'),
            mensagem=data.get('mensagem'),
            status=data.get('status', 'pending'),
            patient_id=patient.id,
        )
        session.add(appt)
        session.commit()

        return jsonify({'success': True, 'appointment_id': appt.id}), 201
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()


if __name__ == '__main__':
    # ensure tables exist
    models.Base.metadata.create_all(engine)
    print('Starting backend on http://127.0.0.1:8000')
    app.run(host='127.0.0.1', port=8000)
