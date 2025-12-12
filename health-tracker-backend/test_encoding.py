from urllib.parse import quote_plus

password = "spoorthi@4639"
encoded = quote_plus(password)

print(f"Original password: {password}")
print(f"URL encoded: {encoded}")
print(f"With %% for ConfigParser: {encoded.replace('%', '%%')}")

# Test the URL
url1 = f"postgresql://postgres:{encoded}@localhost:5432/health_tracker"
url2 = f"postgresql://postgres:{encoded.replace('%', '%%')}@localhost:5432/health_tracker"

print(f"\nURL 1 (single %): {url1}")
print(f"URL 2 (double %%): {url2}")

# Now test connections
from sqlalchemy import create_engine, text

print("\n--- Testing URL 1 (single %) ---")
try:
    engine = create_engine(url1)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✓ SUCCESS with single %")
except Exception as e:
    print(f"✗ FAILED: {e}")

print("\n--- Testing URL 2 (double %%) ---")
try:
    engine = create_engine(url2)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✓ SUCCESS with double %%")
except Exception as e:
    print(f"✗ FAILED: {e}")