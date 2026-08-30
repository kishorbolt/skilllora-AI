
import os
import sys
from dotenv import load_dotenv

load_dotenv('.env')
print('AI_PROVIDER:', os.getenv('AI_PROVIDER'))
print('GEMINI_API_KEY set:', bool(os.getenv('GEMINI_API_KEY')))
print('GEMINI_MODEL:', os.getenv('GEMINI_MODEL'))

import google.generativeai as genai
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    print('API key not found')
    sys.exit(1)

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(os.getenv('GEMINI_MODEL', 'gemini-1.5-flash'))
    response = model.generate_content('Reply with exactly: GEMINI_CONNECTION_OK')
    print('Response:', response.text.strip())
except Exception as e:
    print('Exception:', str(e))

