import openai
import os

# Set up OpenAI API credentials
openai.api_key = os.environ["OPENAI_API_KEY"]

# Define a function to generate a response from GPT-4
def generate_response(prompt):
    # system message is like the hidden prompt
    # assistant message is the gpt output
    # user message is the user input
    response = openai.ChatCompletion.create(
                  model="gpt-3.5-turbo", #gpt-4
                  messages=[{"role": "system", "content": "You are an expert in lesson planning and you will have access to an existing lesson plan from a teacher. Suggest another activity instead of the one listed. additionally suggest one fun, safe and appropriate AI literacy activity for the lesson which can be integrated into the lesson plan for 10 mins. Respond with the new lesson plan in short points without changing the contents of other parts."},
                            {"role": "user", "content": prompt}
                  ])

    result = response["choices"][0]["message"]["content"]
    return response.choices[0].text.strip()

# Start the chat loop
while True:
    # Get user input
    user_input = input("You: ")

    # Generate response from GPT-4
    response = generate_response(user_input)

    # Print response
    print("GPT-4:", response)
