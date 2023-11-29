# app.py
import io
import json
from bs4 import BeautifulSoup
from flask import Flask, jsonify, request
from flask.helpers import send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Import CORS
from flask import send_file
import html2text
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
    if is_valid_html(new_lesson_plan):
        return jsonify({'status': 'success', 'new_lesson_plan':new_lesson_plan}), 200
    else:
        # need to clean up the html
        # call chatgpt to generate a new lesson plan in plain text
        new_lesson_plan = generate_response(components, None, False, False)
    
    return jsonify({'status': 'success', 'new_lesson_plan':new_lesson_plan}), 200

@app.route('/convert-to-md', methods=['POST'])
def convert_to_md():
    html_content = request.data.decode('utf-8')
    
    h = html2text.HTML2Text()
    md_content = h.handle(html_content)

    # Save the RTF content to a temporary file
    temp_filename = 'tempfile.md'
    with open(temp_filename, 'w') as file:
        file.write(md_content)

    return send_file(temp_filename, as_attachment=True)

@app.route('/convert-to-text', methods=['POST'])
def convert_to_text():
    html_content = request.data.decode('utf-8')
    soup = BeautifulSoup(html_content, "html.parser")
    
    # Extract text from HTML while preserving line breaks
    text_content = soup.get_text(separator='\n')

    # Save the text content to a temporary in-memory file
    temp_file = io.StringIO()
    temp_file.write(text_content)
    temp_file.seek(0)

    return send_file(temp_file, as_attachment=True, mimetype='text/plain')


if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    #PROD make debug False
    app.run(debug=True)
