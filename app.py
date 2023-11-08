# app.py
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///lessonplans.db'
db = SQLAlchemy(app)


class LessonPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.JSON)

@app.before_first_request
def create_tables():
    db.create_all()


@app.route('/submit-lesson-plan', methods=['POST'])
def submit_lesson_plan():
    data = request.json
    lesson_plan = LessonPlan(content=data)
    db.session.add(lesson_plan)
    db.session.commit()
    return jsonify({"status": "success", "message": "Lesson plan submitted!"}), 200

if __name__ == '__main__':
    app.run(debug=True)





