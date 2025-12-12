from sqlalchemy import create_engine, text
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)

with engine.connect() as conn:
    # Drop alembic_version table if exists
    conn.execute(text('DROP TABLE IF EXISTS alembic_version CASCADE'))
    conn.commit()
    print("✓ Dropped alembic_version table")