import openai
import os
import json
import inquirer
import datetime 
import argparse

# Set up OpenAI API credentials
openai.api_key = os.environ["OPENAI_API_KEY"]

def editable_str(editable, value):
    """helper function to add editable string to lesson plan"""
    if editable:
        return " (editable: " + str(value) + "): " 
    else:
        return ": "

#function to load and parse json file containing the lesson plan
def parse_lesson_plan(file_path, editable=True):
    # TODO maybe need to have a version that only includes the editable components
    f = open(file_path)
    data = json.load(f)
    lesson_plan = ""
    for key in data:
        if key == 'lesson_title':
            lesson_plan += "Title" + editable_str(editable, data[key]['editable']) + data[key]['value'] + "\n"
        elif key == 'duration':
            lesson_plan += "Duration" + editable_str(editable, data[key]['editable']) + str(data[key]['value']) + " mins\n"
        elif key == 'learning_objectives':
            lesson_plan += "Learning Objectives:\n"
            for id, obj in enumerate(data[key], start=1):
                lesson_plan += "\t" + str(id) + editable_str(editable, obj['editable']) + obj['value'] + "\n"
        elif key == 'discussions':
            lesson_plan += "Discussions:\n"
            for disc in data[key]:
                lesson_plan += "\t- Title" + editable_str(editable, disc['editable']) + disc['title'] + "\n"
                lesson_plan += "\tDescription" + editable_str(editable, disc['editable']) + disc['description'] + "\n"
        elif key == 'activities':
            lesson_plan += "Activities:\n"
            for act in data[key]:
                lesson_plan += "\t- Title" + editable_str(editable, act['editable']) + act['title'] + "\n"
                lesson_plan += "\tDescription" + editable_str(editable, act['editable']) + act['description'] + "\n"
        elif key == 'custom':
            # lesson_plan += "Additional Components:\n"
            for cust in data[key]:
                lesson_plan += cust['type'] + ":\n"
                lesson_plan += "Title" + editable_str(editable, cust['editable']) + cust['title'] + "\n"
                lesson_plan += "Description" + editable_str(editable, cust['editable']) + cust['description'] + "\n"
    if 'ai_activity_duration' in data and data['ai_activity_duration']['value'] > 0:
            lesson_plan += "AI Activity Duration (editable: True): " + str(data[key]['value']) + " mins\n"
            
    return lesson_plan
        
#function to load and print json file containing the lesson plan
def print_lesson_plan(file_name):
    f = open(file_name)
    data = json.load(f)
    # pretty print the json
    print(json.dumps(data, indent=4))
    
    # if 'activities' in data:
    #     for act in data['activities']:
    #         print(act['title'])
    #         print(act['description'])
    #         print(act['editable'])
    #     f.close()
    # else:
    #     print("WARNING! No activities in lesson plan.")
    #     f.close()

#function to read multiline input
def get_multiline_input():
    print("Double-enter to save it.")
    content = []
    while True:
        try:
            data = input()
            content.append(data)
            if not data: 
                content_str = "\n".join(content[:-1])
                return content_str
        except KeyboardInterrupt:
            return

# Define a function to generate a response from GPT-4
def generate_response(file_name):
    # system message is like the hidden prompt
    # assistant message is the gpt output
    # user message is the user input
    
    lesson_plan = parse_lesson_plan(file_name)
    
    
    prompt = "What is physical computing?Share a definition of physical computing upon which this course is based.Physical Computing is an approach to computer-human interaction design that starts by considering how humans express themselves physically.Review keywords and phrases from the definition.Computer-human interaction design: Every device has a trigger and a response (input and output). The way we use a device was decided by designers and engineers. How humans express themselves physically: The physical actions that we are capable of can be used to trigger a response from a device. We can press with our fingers, step with our feet, turn with our wrists, and so on. These are all considerations when designing interactions."
    response = openai.ChatCompletion.create(
                  model="gpt-3.5-turbo", #gpt-4
                  messages=[{"role": "system", "content": "You are an expert in lesson planning and you will have access to an existing lesson plan from a teacher. Suggest another activity instead of the one listed. additionally suggest one fun, safe and appropriate AI literacy activity for the lesson which can be integrated into the lesson plan for 10 mins. Respond with the new lesson plan in short points without changing the contents of other parts."},
                            {"role": "user", "content": prompt}
                  ])

    result = response["choices"][0]["message"]["content"]
    print(result)
    #return response.choices[0].text.strip()


#function to input and save lesson plan
def input_lesson_form(args):
    if args.input:
        lesson_plan = json.load(open(args.input))
    else:
        lesson_plan={}
    form = 1
    
    # TODO (eventually) dont allow empty inputs
    # TODO (eventually) add overview section, maybe as well as other sections. for now these are covered in catch all custom component
    # TODO (eventually) allow user to specify the order of the lesson. currently its grouped by our ordering and type of component
    
    print("Hello! Please enter your current lesson plan. At a minimum, you must give a Title, Learning Objectives, and Duration.\n\
        For each component, you will be asked whether it is 'editable.' This means that the AI will potentially modify this section in order to add AI Literacy learning objectives and/or activities.\n\
        Ideally, you should include at least one activity that is editable. If not, the AI will suggest a new AI literacy activity for you.")
    while form:
        form_choice = [
        inquirer.List('lesson_parameters',
                    message="What would you like to input? When you are done, select 'Save Form'",
                    choices=['Title', 'Learning Objectives', 'Duration', 'Discussions', 'Activities', 'Custom Component', 'Save Form'],
                ),
        ]

        lesson_parameter = inquirer.prompt(form_choice)['lesson_parameters']

        confirmation = True
        cur_dict = {}
        if lesson_parameter == "Title": 
            if 'lesson_title' in lesson_plan:
                print("Current Title:\n", lesson_plan['lesson_title']['value'], ", Editable: ",lesson_plan['lesson_title']['editable'])

                confirm = {
                    inquirer.Confirm('confirmation',
                        message="Do you want to enter a new title?" ,
                        default=False),
                }
                confirmation = inquirer.prompt(confirm)['confirmation']
                print(confirmation)
            if confirmation == True:
                lesson_details = {
                    inquirer.Text("parameter", message="Enter the title of the lesson"),
                    inquirer.Confirm('confirmation',
                        message="Do you want to make 'Title' an editable parameter by the AI?" ,
                        default=False),
                }
                inq_var = inquirer.prompt(lesson_details)
                cur_dict['value'] = inq_var['parameter']
                cur_dict['editable'] = inq_var['confirmation']
                lesson_plan['lesson_title'] = cur_dict


        if lesson_parameter == "Duration": 
            if 'duration' in lesson_plan:
                print("Current Duration:\n ", lesson_plan['duration']['value'], "mins, Editable: ", lesson_plan['duration']['editable'])
                confirm = {
                    inquirer.Confirm('confirmation',
                        message="Do you want to enter a new duration?" ,
                        default=False),
                }
                confirmation = inquirer.prompt(confirm)['confirmation']
            if confirmation == True:
                lesson_details = {
                    inquirer.Text("parameter", message="Enter the duration of the lesson in minutes"),
                    inquirer.Confirm('confirmation',
                        message="Do you want to make 'Duration' an editable parameter by the AI?" ,
                        default=False),
                }
                inq_var = inquirer.prompt(lesson_details)
                cur_dict['value'] = int(inq_var['parameter'])
                cur_dict['editable'] = inq_var['confirmation']
                lesson_plan['duration'] = cur_dict
   

        elif lesson_parameter == "Learning Objectives":
            # TODO reevaluate whether to keep as a list or make it one string with bullets/newlines. current upside is editable for each objective, but i honestly dont think its necessary, unless we always allow the AI to add new objectives
            if 'learning_objectives' in lesson_plan:
                print("Current Learning Objectives:\n")
                for item in lesson_plan['learning_objectives']:
                    print("-",item['value'])
                    print("Editable: ", item['editable'])
                confirm = {
                    inquirer.Confirm('confirmation',
                     message="Do you want to enter a new learning objective?" ,
                     default=False),
                }
                confirmation = inquirer.prompt(confirm)['confirmation']
            
            if confirmation == True:
                print("Enter learning objective for the lesson:")
                user_input= get_multiline_input()
                cur_dict['value'] = user_input

                lesson_details = {
                    # inquirer.Text("parameter", message="Enter learning objective for the lesson"),
                    inquirer.Confirm('confirmation',
                        message="Do you want to make this 'Learning Objective' an editable parameter by the AI?" ,
                        default=False),
                }
                inq_var = inquirer.prompt(lesson_details)
                # cur_dict['value'] = inq_var['parameter']
                cur_dict['editable'] = inq_var['confirmation']
                if 'learning_objectives' in lesson_plan:
                    lesson_plan['learning_objectives'].append(cur_dict)
                else:
                    lesson_plan['learning_objectives']=[]
                    lesson_plan['learning_objectives'].append(cur_dict)


        elif lesson_parameter == "Discussions":
            if 'discussions' in lesson_plan:
                print("Current Discussions:\n")
                for item in lesson_plan['discussions']:
                    print("-Title: ",item['title'])
                    print("Description: ",item['description'])
                    print("Editable: ", item['editable'])
                confirm = {
                    inquirer.Confirm('confirmation',
                     message="Do you want to enter a new discussion?" ,
                     default=False),
                }
                confirmation = inquirer.prompt(confirm)['confirmation']
            
            if confirmation == True:
                user_input = input("Enter title for the discussion:")
                cur_dict['title'] = user_input

                print("Enter description of discussion:")
                user_input= get_multiline_input()
                cur_dict['description'] = user_input

                lesson_details = {
                    # inquirer.Text("parameter", message="Enter discussion title for the lesson"),
                    # inquirer.Text("parameter_descr", message="Enter description of discussion"),
                    inquirer.Confirm('confirmation',
                        message="Do you want to make this 'Discussion' an editable parameter by the AI?" ,
                        default=False),
                }
                inq_var = inquirer.prompt(lesson_details)
                cur_dict['editable'] = inq_var['confirmation']
                if 'discussions' in lesson_plan:
                    lesson_plan['discussions'].append(cur_dict)
                else:
                    lesson_plan['discussions']=[]
                    lesson_plan['discussions'].append(cur_dict)

        elif lesson_parameter == "Activities":
            if 'activities' in lesson_plan:
                print("Current Activities:\n")
                for item in lesson_plan['activities']:
                    print("-Title: ",item['title'])
                    print("Description: ",item['description'])
                    print("Editable: ", item['editable'])
                confirm = {
                    inquirer.Confirm('confirmation',
                     message="Do you want to enter a new activity?" ,
                     default=False),
                }
                confirmation = inquirer.prompt(confirm)['confirmation']
            
            if confirmation == True:
                user_input = input("Enter activity title:")
                cur_dict['title'] = user_input

                print("Enter description of activity (including desired length in minutes, if applicable):")
                user_input= get_multiline_input()
                cur_dict['description'] = user_input

                lesson_details = {
                    # inquirer.Text("parameter", message="Enter activity title for the lesson"),
                    # inquirer.Text("parameter_descr", message="Enter description of activity"),
                    inquirer.Confirm('confirmation',
                        message="Do you want to make this 'Activity' an editable parameter by the AI?" ,
                        default=False),
                }
                inq_var = inquirer.prompt(lesson_details)
                cur_dict['editable'] = inq_var['confirmation']
                if 'activities' in lesson_plan:
                    lesson_plan['activities'].append(cur_dict)
                else:
                    lesson_plan['activities']=[]
                    lesson_plan['activities'].append(cur_dict)
                    
        elif lesson_parameter == "Custom Component":
            if confirmation == True:
                user_input = input("Enter type of component:")
                cur_dict['type'] = user_input

                user_input = input("Enter a title:")
                cur_dict['title'] = user_input

                print("Enter a description:")
                user_input= get_multiline_input()
                cur_dict['description'] = user_input

                lesson_details = {
                    inquirer.Confirm('confirmation',
                        message="Do you want to make this 'Custom Component' an editable parameter by the AI?" ,
                        default=False),
                }
                inq_var = inquirer.prompt(lesson_details)
                cur_dict['editable'] = inq_var['confirmation']
                if 'custom' in lesson_plan:
                    lesson_plan['custom'].append(cur_dict)
                else:
                    lesson_plan['custom']=[]
                    lesson_plan['custom'].append(cur_dict)
        
        elif lesson_parameter == "Save Form":
            edit_activities = False
            if 'activities' in lesson_plan:
                for act in lesson_plan['activities']:
                    # check if any activities are editable, if none are, 
                    # then ask if they want a new activity with ai lit incorporated and length as below
                    if act['editable']: # == True:
                        edit_activities = True
                        break
            if edit_activities == False:
                print("None of your activities are marked as editable for the AI. Would you like the AI to suggest a new AI literacy activity?")
                lesson_details = {
                    inquirer.Text("parameter", message="If so, please enter the activity length in minutes. If not, enter 0")
                    }
                inq_var = inquirer.prompt(lesson_details)
                cur_dict['value'] = int(inq_var['parameter'])
                cur_dict['editable'] = True
                lesson_plan['ai_activity_duration'] = cur_dict
            
            print("Here is the saved lesson plan:")
            print(json.dumps(lesson_plan, indent=4))
            now = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M")
            output_dir = os.path.join(os.path.abspath(os.getcwd()), 'output') # TODO use argparse to make this flexible
            file_name = 'lesson_plan_' + now + '.json'
            file_path = os.path.join(output_dir, file_name)
            with open(file_path, 'w') as fp:
                json.dump(lesson_plan, fp, indent=4)
            form = 0

    return file_path

if __name__ == "__main__":
    argparse = argparse.ArgumentParser()
    argparse.add_argument('--input', type=str, default=None, help='input json file name')
    argparse.add_argument('--output', type=str, default='output', help='output directory name')
    args = argparse.parse_args()
    
    file_path = input_lesson_form(args)
    # print_lesson_plan(file_path)
    print(parse_lesson_plan(file_path))
    # generate AI modified lesson plan
    #generate_response()
