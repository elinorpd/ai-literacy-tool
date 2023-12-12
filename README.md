# AI Literacy Lesson Planner Tool

A project for MIT Media Lab [MAS.S10: Generative Artificial Intelligence in K-12 Education](https://mit-cml.github.io/gen-ai-fall-2023.github.io/) by Shrestha Mohanty, Elinor Poole-Dayan, and Swati Garg.

## Instructions
1. Install necessary python libraries with `pip install -r requirements.txt`
2. Create a command line environment variable with your private OpenAI API key via `export OPENAI_API_KEY='sk-yourkeyhere'`
3. In the `ai-literacy-tool/flask-app` directory, run `python app.py`
4. In the `ai-literacy-tool/aillp-builder/src` directory, run `npm start`. This will open the web app locally to [http://localhost:3000/](http://localhost:3000/).

## Motivation 
- There is a growing need for AI literacy in younger students as AI tools are increasingly accessible
- Not all schools (especially public schools) have the resources, expertise, or time to develop and incorporate specialized AI literacy programs for students
- As usage of generative AI tools in education becomes more prevalent, it is important to learn about AI literacy in multiple contexts
- AI literacy will look differently depending on the field, so we want specific activities tailored to each of these domains to reflect that

### Solution: 

Specialized/customized AI Literacy activities and learning objectives blended into existing middle school classes.
However, many school teachers do not have the expertise or capacity to develop new lessons without extra resources!

## What will our tool do?

- Generative AI tool to aid teachers incorporate AI literacy activities into their exsiting lesson plans
- Features of the tool:
  - A simple, flexible interface for the educator to input their current lesson plan, specify AI literacy learning objectives, and add any other lesson parameters they need
  - A domain-specific lesson plan is automatically developed which incorporates AI literacy activities
- Activities can be modified as necessary after
- This will allow educators to more easily come up with a class plan to teach students AI concepts and how to interact with these tools safely
- The tool is designed to be open ended and thus can be used across a variety of academic disciplines and topics such as science, history, english literature, arts, etc
- We are in the process of meeting with middle school educators to update our design to cater more directly to their needs and experiences as teachers today

## Sample Files

- `lesson_plan_physical-computing_text.txt` : sample lesson plan in text format which can be used to copy/ paste as an input 