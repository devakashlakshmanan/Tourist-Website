import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
from destinations_data import DESTINATIONS

load_dotenv(override=True)

app = Flask(__name__)
CORS(app)

# Initialize Groq client
groq_api_key = os.getenv("GROQ_API_KEY")
client = None
if groq_api_key:
    try:
        client = Groq(api_key=groq_api_key)
    except Exception as e:
        print(f"Warning: Failed to initialize Groq client: {e}")

@app.route('/api/destinations', methods=['GET'])
def get_destinations():
    # Return the massive static list
    return jsonify(DESTINATIONS)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    history = data.get('history', [])
    
    # Enhanced formatting context for Groq
    system_prompt = """You are a highly knowledgeable, culturally aware, and enthusiastic virtual Indian tour guide named 'Tourist Companion'. 
Your primary job is to provide engaging, accurate, and structured information about Indian tourism, states, historical sites, visas, travel safety, and local customs.
If the user asks about a specific destination, act as an expert on that location, offering travel tips, best times to visit, local cuisine, and historical facts.
Keep your responses well-formatted with lists or short paragraphs for readability. Always remain polite and deeply respectful of Indian culture and diversity."""

    messages = [{"role": "system", "content": system_prompt}]
    
    for msg in history:
        # Ignore custom welcome / system messages that didn't come from actual history 
        if msg.get('id') == 1 and msg.get('sender') == 'ai':
            continue
        role = "assistant" if msg.get('sender') == 'ai' else "user"
        messages.append({"role": role, "content": msg['text']})
        
    messages.append({"role": "user", "content": user_message})

    # Try using the SDK first if available
    if client:
        try:
            completion = client.chat.completions.create(
                model="llama-3.1-8b-instant", 
                messages=messages,
                temperature=0.6,
                max_tokens=600
            )
            return jsonify({"reply": completion.choices[0].message.content})
        except Exception as e:
            print(f"SDK Chat Error: {e}")
            # Fall through to requests fallback
    
    # Fallback to direct HTTP requests using urllib (no requests library)
    if groq_api_key:
        try:
            import urllib.request
            import json
            
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {groq_api_key}",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
            payload = {
                "model": "llama-3.1-8b-instant",
                "messages": messages,
                "temperature": 0.6,
                "max_tokens": 600
            }
            
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                return jsonify({"reply": result['choices'][0]['message']['content']})
                
        except Exception as e:
            return jsonify({"reply": f"AI Guide connection error: {str(e)}. Please verify your GROQ_API_KEY."})
            
    return jsonify({"reply": "AI Guide is currently unavailable. Please provide a valid GROQ_API_KEY in the .env file."})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
