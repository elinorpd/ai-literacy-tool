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

# helper function to parse lesson plan components list into a string
def parse_lesson_plan(components):
    components_str = ""
    for component in components:
        if component["type"] in ['Title', 'Audience', 'Overview', 'Learning Objectives', 'Assessment']:
            components_str += f'{component["type"]}: ' + component["properties"]["value"] + "\n"
            
        if component["type"] == 'Duration':
            components_str += f'Lesson {component["type"]}: ' + component["properties"]["value"] + "mins.\n"
            
        elif component["type"] == 'Activity':
            components_str += component["type"] + " Title: " + component["properties"]["title"] + editable_str(True, component["properties"]["editable"]) + component["properties"]["value"] + "\n" 
            if component["properties"]["assessment"] != "":
                components_str += "Activity Assessment: " + component["properties"]["assessment"] + "\n"
            
        elif component["type"] == 'AIActivity':
            components_str += "AI Literacy Activity" + editable_str(True, component["properties"]["editable"]) + "\nDuration " + str(component["properties"]["value"]) + "minutes.\nActivity requirements: "  + component["properties"]["req"] + "\n" + "AI Literacy Activity Assessment: \n"
            
        elif component["type"] == 'Custom':
            components_str += "Title: " + component["properties"]["title"] + editable_str(True, component["properties"]["editable"]) + component["properties"]["value"] + "\n"
            
        elif component["type"] == 'AIObjectives':
            # if any of the existing objectives are checked, add them to the lesson plan
            if any([o["checked"]==True for o in component["properties"]["checklist"]]):
                components_str += "AI Literacy Learning Objectives" + editable_str(True, component["properties"]["editable"]) + "\n".join([o["label"] for o in component["properties"]["checklist"] if o["checked"]==True]) + "\n"
            elif component["properties"]["customObjective"] != "":
                components_str += "AI Literacy Learning Objectives" + editable_str(True, component["properties"]["editable"]) + component["properties"]["customObjective"] + "\n"
            
    return components_str

def parse_lesson_plan_html(components):
    components_str = ""
    for component in components:
        if component["type"] == 'Title': 
            components_str += f'<h3>{component["type"]}: {component["properties"]["value"]}</h3>' + "<br/><br/>\n"
        
        elif component["type"] in ['Audience', 'Overview', 'Learning Objectives', 'Assessment']:
            components_str += f'<h3>{component["type"]}:</h3><br/><p>{component["properties"]["value"]}</p>'  + "<br/>\n"
        
        elif component["type"] == 'Duration':
            components_str += f'<h3>Lesson {component["type"]}:</h3><br/><p>{component["properties"]["value"]} mins.</p>'  + "<br/>\n"
       
        elif component["type"] == 'Activity':
            components_str += f'<h3>{component["type"]} Title:</h3><br/><p>{component["properties"]["title"]}</p>'  + "<br/>\n"
            components_str += f'<h5>{component["type"]} Description:</h5><br/><p>{component["properties"]["value"]}</p>'  + "<br/>\n"
            if component["properties"]["assessment"] != "":
                components_str += f'<h5>{component["type"]} Assessment:</h5><br/><p>{component["properties"]["assessment"]}</p>'  + "<br/>\n"
       
        elif component["type"] == 'AIActivity':
            components_str += f'<h3>AI Literacy Activity</h3><br/><p>Duration {component["properties"]["value"]} minutes.</p>'  + "<br/>\n"
            components_str += f'<h5>AI Literacy Activity Description:</h5><br/><p>{component["properties"]["req"]}</p>'  + "<br/>\n"
            components_str += f'<h5>AI Literacy Activity Assessment:</h5><br/><p>short assessment goes here</p>'  + "<br/>\n"    
    
        elif component["type"] == 'Custom': # disabled for now
            components_str += f'<h3>Title:{component["properties"]["title"]}</h3>'  + "<br/>\n"
            components_str += f'<h5>Description:</h5><br/><p>{component["properties"]["value"]}</p>'  + "<br/>\n"
            
        elif component["type"] == 'AIObjectives':
            # if any of the existing objectives are checked, add them to the lesson plan
            if any([o["checked"]==True for o in component["properties"]["checklist"]]):
                components_str += f'<h3>AI Literacy Learning Objectives</h3><br/><p>' + "\n<ul>\n"
                # create html bullet list
                components_str += "\n".join([f'<li>{o["label"]}</li>' for o in component["properties"]["checklist"] if o["checked"]==True])
            elif component["properties"]["customObjective"] != "":
                components_str += f'<li>{component["properties"]["customObjective"]}</li>\n</ul>\n<br/>\n'
                
    return components_str
    

#function to load and parse json file containing the lesson plan
def parse_lesson_plan_cli(file_path, editable=True):
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
            if 'ai_activity_duration' in data and data['ai_activity_duration']['value'] > 0:
                lesson_plan += "\t- AI Activity (editable: True):\n"
                lesson_plan += "\tDescription (editable: True): " + f"{str(data['ai_activity_duration']['value'])} minute activity goes here.\n"
        elif key == 'custom':
            # lesson_plan += "Additional Components:\n"
            for cust in data[key]:
                lesson_plan += cust['type'] + ":\n"
                lesson_plan += "Title" + editable_str(editable, cust['editable']) + cust['title'] + "\n"
                lesson_plan += "Description" + editable_str(editable, cust['editable']) + cust['description'] + "\n"            
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
def generate_response(file_name, args=None, save=True, html=True):
    """
    Generates a new lesson plan by modifying editable sections of an existing lesson plan using OpenAI's GPT-3 language model.

    Args:
        file_name (str): The file path of the existing lesson plan to modify.
        args (argparse.Namespace, optional): Command-line arguments. Defaults to None.

    Returns:
        str: The original lesson plan with modified editable sections, written to a new file.
    """   
    # disabling functionality for inputting a file name because its irrelevant now. we can add this functinoality back in later if we want
    # print(type(file_name))
    # print(file_name)
    # if type(file_name) != str:
    #     lesson_plan = file_name
    # else:
    #     lesson_plan = parse_lesson_plan(file_name)
    # print(lesson_plan)
    
    lesson_plan = parse_lesson_plan_html(file_name)
    print(lesson_plan)
    html_str = "html formatting within a <p></p>" if html else "plain text formatting"

    response = openai.ChatCompletion.create(
                  model=args.model if args else "gpt-4-1106-preview",
                  messages=[
                      {"role": "system", "content": f"You are an expert in AI literacy and middle school education. We will give you an existing lesson plan from a middle school teacher. For each component of the plan, it will indicate whether or not you should edit that section. For any activities that have 'editable: True', please modify or replace the activity with an engaging, safe, and time-appropriate AI literacy activity relevant to the lesson. Do not change any components with 'editable: False'. For other editable sections, modify if you think it is necessary to incorporate AI Literacy learning objectives and maintain coherence.\n\nReturn only the lesson plan in {html_str}, with your edits to the editable sections with no additional text or references to your edits. Don't include the (editable: value) statements."},
                      {"role": "user", "content": str(lesson_plan)},
                  ],
                  )

    result = response["choices"][0]["message"]["content"]
    print("Here is the new lesson plan:")
    print(result)
    if save: # save the file to output_dir
        now = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M")
        if not args:
            output_dir = os.path.join(os.path.abspath(os.getcwd()), args.output_dir)
        else:
            output_dir = os.path.abspath(os.getcwd())
        # check if output_dir is a directory, if not, create it
        if os.path.isdir(output_dir) == False:
            os.mkdir(output_dir)
        file_name = 'ai_lesson_plan_' + now + '.txt'
        file_path = os.path.join(output_dir, file_name)
        with open(file_path, 'w') as fp:
            fp.write(result)
    
    return result

#function to input and save lesson plan
def input_lesson_form(args):
    if args.input:
        lesson_plan = json.load(open(args.input))
    else:
        lesson_plan={}
    form = 1
    
    # TODO!! allow teacher to select from a list of AI Literacy learning objectives (or write their own) to guide the edits
    # TODO(eventually) dont allow empty inputs
    # TODO(eventually) add overview section, maybe as well as other sections. for now these are covered in catch all custom component
    # TODO(eventually) allow user to specify the order of the lesson. currently its grouped by our ordering and type of component
    
    print("Hello! Please enter your current lesson plan. At a minimum, you must give a Title, Learning Objectives, and Duration.\n\
        For each component, you will be asked whether it is 'editable.' This means that the AI will potentially modify this section in\n\
            order to add AI Literacy learning objectives and/or activities. Ideally, you should include at least one activity that is editable.\n\
            If not, the AI will suggest a new AI literacy activity for you.")
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
                lesson_plan['duration']['value'] += lesson_plan['ai_activity_duration']['value']
            
            print("Here is the saved lesson plan:")
            print(json.dumps(lesson_plan, indent=4))
            now = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M")
            output_dir = os.path.join(os.path.abspath(os.getcwd()), args.output_dir) # TODO use argparse to make this flexible
            if os.path.isdir(output_dir) == False:
                os.mkdir(output_dir)
            file_name = 'lesson_plan_' + now + '.json'
            file_path = os.path.join(output_dir, file_name)
            with open(file_path, 'w') as fp:
                json.dump(lesson_plan, fp, indent=4)
            form = 0

    return file_path

if __name__ == "__main__":
    argparse = argparse.ArgumentParser()
    argparse.add_argument('--input', type=str, default=None, help='optional input json file name')
    argparse.add_argument('--output_dir', type=str, default='output', help='optional output directory name (relative path), default "output"')
    argparse.add_argument('--model', type=str, default='gpt-3.5-turbo', help='openai model to use, default "gpt-3.5-turbo" or use "gpt-4"')
    args = argparse.parse_args()
    
    file_path = input_lesson_form(args)
    # print_lesson_plan(file_path)
    print(parse_lesson_plan(file_path))
    # generate AI modified lesson plan
    print("Generating AI modified lesson plan...")
    generate_response(file_path, args)
