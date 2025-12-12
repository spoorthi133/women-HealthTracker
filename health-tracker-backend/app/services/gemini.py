import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("models/gemini-pro-latest")

def ask_gemini(prompt: str) -> str:
    response = model.generate_content(prompt)
    return response.text
