# app.py
import io
import json
from bs4 import BeautifulSoup
from flask import Flask, jsonify, request
from flask.helpers import send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Import CORS
from flask import send_file
from flask import Response
from htmldocx import HtmlToDocx
from chat_script import generate_response

#PROD app
# app = Flask(__name__, static_folder='build', static_url_path='/')

#LOCAL app
app = Flask(__name__)

CORS(app)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}) # allow all origins on port 3000
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///lessonplans.db'
db = SQLAlchemy(app)

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

class LessonPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.JSON)
    
def is_valid_html(html_string):
    try:
        BeautifulSoup(html_string, "html.parser")
        return True
    except Exception as e:
        print(f"Invalid HTML: {e}")
        return False

@app.route('/api/submit', methods=['POST'])
def handle_submit():
    components = request.json
    print('Received components:', components)
        
    # Logic to save components into a JSON file
    with open('components.json', 'w') as file:
        json.dump(components, file, indent=4)
        
    # now do the thing to create the lesson plan
    new_lesson_plan = generate_response(components, None, False)
    # print(new_lesson_plan)
    while not is_valid_html(new_lesson_plan):
        print('Invalid HTML, trying again')
        # call chatgpt to generate a new lesson plan
        new_lesson_plan = generate_response(components, None, False)

    return jsonify({'status': 'success', 'new_lesson_plan':new_lesson_plan}), 200

@app.route('/convert-to-docx', methods=['POST'])
def convert_to_docx():
    html_content = request.data.decode('utf-8')
    
    docx_parser = HtmlToDocx()
    docx = docx_parser.parse_html_string(html_content)

    # Save the document to an in-memory file
    file_stream = io.BytesIO()
    docx.save(file_stream)
    file_stream.seek(0)

    return send_file(file_stream, as_attachment=True, download_name='lesson_plan.docx')

@app.route('/convert-to-text', methods=['POST'])
def convert_to_text():
    html_content = request.data.decode('utf-8')
    soup = BeautifulSoup(html_content, "html.parser")
    
    # Extract text from HTML while preserving line breaks
    text_content = soup.get_text(separator='\n')

    # Create a response with the text content and headers for downloading
    response = Response(text_content, mimetype='text/plain')
    response.headers['Content-Disposition'] = 'attachment; filename=lesson_plan.txt'

    return response

@app.route('/<path:path>')
def catch_all(path='index'):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True)
