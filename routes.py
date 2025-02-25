from flask import render_template, request, jsonify
from app import app
from email_validator import validate_email, EmailNotValidError

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit-contact', methods=['POST'])
def submit_contact():
    if request.method == 'POST':
        try:
            name = request.form.get('name')
            email = request.form.get('email')
            company = request.form.get('company')
            message = request.form.get('message')

            # Validate required fields
            if not all([name, email, company, message]):
                return jsonify({
                    'status': 'error',
                    'message': 'Tutti i campi sono obbligatori.'
                }), 400

            # Validate email
            try:
                valid = validate_email(email)
                email = valid.email
            except EmailNotValidError:
                return jsonify({
                    'status': 'error',
                    'message': 'Per favore inserisci un indirizzo email valido.'
                }), 400

            # Here you would typically:
            # 1. Save to database
            # 2. Send notification email
            # 3. Add to CRM system
            # For now, we'll just return success

            return jsonify({
                'status': 'success',
                'message': 'Grazie per il tuo messaggio! Ti contatteremo presto.'
            }), 200

        except Exception as e:
            app.logger.error(f"Error in form submission: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'Si è verificato un errore. Riprova più tardi.'
            }), 500

    return jsonify({
        'status': 'error',
        'message': 'Metodo non valido'
    }), 405