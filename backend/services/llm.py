from dotenv import load_dotenv
import os
from groq import Groq
import json
from ast import literal_eval

from utils.performance import measure_time

load_dotenv()
KEY=os.getenv("GROQ_KEY")
client = Groq(api_key=KEY)

@measure_time
def groq_inference(content_list):
    messages=[
        {
            "role": "system",
            "content":"You are a backend service to process natural language data as part of an app.\
            Sort the array by increasing 'price' and return the data ALONE with NO extra verbosity.\
            $1.20/hr MUST BE CHEAPER than $1.20 per ½ hr\
            "
        },
        {
            "role": "user",
            "content": str(content_list)
        }
    ]

    chat_completion = client.chat.completions.create(
        messages=messages,
        model="llama-3.2-90b-vision-preview",
        temperature=0
    )

    data = chat_completion.choices[0].message.content
    # start_idx = data.find('[')
    # end_idx = data.rfind(']')
    # if start_idx != -1 and end_idx != -1:
    #     data = data[start_idx:end_idx + 1]
    parsed_data = literal_eval(data)
    print(parsed_data)
    return parsed_data
