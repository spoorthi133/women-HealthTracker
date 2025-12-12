from sqlalchemy import create_engine, text
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)

try:
    with engine.connect() as conn:
        result = conn.execute(text('SELECT * FROM alembic_version'))
        versions = list(result)
        if versions:
            print(f"Alembic version in database: {versions}")
        else:
            print("alembic_version table exists but is empty")
except Exception as e:
    print(f"No alembic_version table found (or error): {e}")