from sqlalchemy import create_engine, text
from app.core.config import settings

print("Testing database connection...")
print(f"DATABASE_URL: {settings.DATABASE_URL}")
print()

try:
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version();"))
        version = result.fetchone()[0]
        print("✓ Connection successful!")
        print(f"PostgreSQL version: {version}")
        print()
        
        # Test if we can see any tables
        result = connection.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """))
        tables = result.fetchall()
        
        if tables:
            print(f"Existing tables ({len(tables)}):")
            for table in tables:
                print(f"  - {table[0]}")
        else:
            print("No tables found in database (this is normal before running migrations)")
            
except Exception as e:
    print(f"✗ Connection failed: {e}")