import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

# ✅ Use a confirmed text-capable model
model = genai.GenerativeModel("models/gemini-pro-latest")

response = model.generate_content(
    "Give short health advice related to menstrual cycle tracking."
)

print("\n✅ Gemini response:\n")
print(response.text)
