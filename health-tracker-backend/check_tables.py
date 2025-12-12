from sqlalchemy import create_engine, inspect
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
inspector = inspect(engine)

for table_name in inspector.get_table_names():
    if table_name != 'alembic_version':
        print(f"\n📋 Table: {table_name}")
        columns = inspector.get_columns(table_name)
        for col in columns:
            nullable = "NULL" if col['nullable'] else "NOT NULL"
            print(f"  - {col['name']}: {col['type']} {nullable}")