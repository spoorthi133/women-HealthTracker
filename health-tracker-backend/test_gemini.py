from google import genai
from app.core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents="Give short health advice related to menstrual cycle tracking."
)

print("\n✅ Gemini response:\n")
print(response.text)