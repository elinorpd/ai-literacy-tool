# app.py
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Import CORS
import json


app = Flask(__name__)
CORS(app)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}) # allow all origins on port 3000
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///lessonplans.db'
db = SQLAlchemy(app)


class LessonPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.JSON)

# @app.after_request
# def after_request_func(response):
#     print("Response headers:", response.headers)
#     return response


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
    
    return jsonify({'status': 'success'}), 200

# @app.route('/api/submit', methods=['OPTIONS'])
# def handle_options_request():
#     return ('', 204, {
#         'Access-Control-Allow-Origin': 'http://localhost:3000',
#         'Access-Control-Allow-Methods': 'POST, OPTIONS',
#         'Access-Control-Allow-Headers': 'Content-Type',
#     })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True)





