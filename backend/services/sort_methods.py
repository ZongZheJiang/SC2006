from dotenv import load_dotenv
import os
from groq import Groq
import json
from ast import literal_eval
from utils.performance import measure_time

load_dotenv()

def sort_by_lots(carpark_data):
    return

def sort_by_price(carpark_data):
    with_price=[]
    without_price=[]
    for carpark in carpark_data:
        if carpark["price"]=="":
            without_price.append(carpark)
        else:
            with_price.append(carpark)
    sorted_with_price = natural_language_sort(with_price)
    sorted_with_price.extend(without_price)
    carpark_data.clear()
    carpark_data.extend(sorted_with_price)
    return carpark_data

def natural_language_sort(carpark_with_prices):
    data=[]
    for carpark in carpark_with_prices:
        data.append({"id":carpark["carpark_id"], "price":carpark["price"]})

    sorted_llm_data = groq_inference(data)

    sorted_order = {item["id"]: index for index, item in enumerate(sorted_llm_data)}

    sorted_carparks = sorted(
        carpark_with_prices,
        key=lambda x: sorted_order.get(x["carpark_id"], float('inf'))
    )

    return sorted_carparks

KEY=os.getenv("GROQ_KEY")
client = Groq(api_key=KEY)
@measure_time
def groq_inference(content_list):
    messages = [
            {
                "role": "system",
                "content": """You are a precise data processing service. Follow these requirements EXACTLY:

    1. TASK: Sort the input array by 'price' in ascending order
    2. FORMAT REQUIREMENTS:
       - Maintain all original data fields
       - Preserve exact string formats (esp. double quotes)
       - Return ONLY the sorted array as valid JSON
       - NO explanatory text or markdown
    3. PRICE HANDLING:
       - Convert all prices to hourly rate before sorting
       - Example: "$1.20 per ½ hr" = $2.40/hr
       - Handle variations like: /hr, per hour, per ½ hour, /half-hour
    4. VALIDATION:
       - Ensure output is parseable JSON array
       - Verify all original fields are preserved
       - Confirm prices are correctly ordered

    OUTPUT FORMAT: [{"field": "value", ...}, ...]"""
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
    print(data)
    parsed_data = literal_eval(data)
    return parsed_data
