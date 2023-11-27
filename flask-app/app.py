# app.py
import json
from bs4 import BeautifulSoup
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Import CORS
from chat_script import generate_response


app = Flask(__name__, static_folder='build', static_url_path='/')
#app = Flask(__name__)
CORS(app)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}) # allow all origins on port 3000
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///lessonplans.db'
db = SQLAlchemy(app)


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

@app.route('/submit-lesson-plan', methods=['POST'])
def submit_lesson_plan():
    data = request.json
    lesson_plan = LessonPlan(content=data)
    db.session.add(lesson_plan)
    db.session.commit()
    return jsonify({"status": "success", "message": "Lesson plan submitted!"}), 200
        

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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=False)
