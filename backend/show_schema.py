import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"), override=True)

engine = create_engine(os.getenv("DATABASE_URL"))

with engine.connect() as connection:
    tables = [row[0] for row in connection.execute(text("SHOW TABLES"))]
    print("TABLES:", tables)

    for table in ("users", "products", "categories"):
        if table not in tables:
            print(f"\n[{table} table nahi mila]")
            continue

        create_sql = connection.execute(text(f"SHOW CREATE TABLE `{table}`")).fetchone()[1]
        count = connection.execute(text(f"SELECT COUNT(*) FROM `{table}`")).scalar()
        print(f"\n{create_sql}\nROWS: {count}")

    if "products" in tables:
        try:
            statuses = [row[0] for row in connection.execute(text("SELECT DISTINCT status FROM products"))]
            print("\nPRODUCT STATUS VALUES:", statuses)
        except Exception:
            print("\nproducts mein status column nahi hai")