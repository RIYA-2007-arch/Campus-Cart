import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(BASE_DIR, ".env")

print("1) .env file mili:", os.path.exists(env_path))
load_dotenv(env_path, override=True)

url_text = os.getenv("DATABASE_URL")
print("2) DATABASE_URL .env mein hai:", bool(url_text))

if not url_text:
    print("\nPROBLEM: .env mein DATABASE_URL line nahi mili.")
    print("Is format mein likho (quotes aur space ke bina):")
    print("DATABASE_URL=mysql+pymysql://root:PASSWORD@localhost/campuscart")
    raise SystemExit

url = make_url(url_text)
print("3) User:", url.username, "| Host:", url.host, "| Database:", url.database)
print("   Password diya gaya:", bool(url.password))

try:
    engine = create_engine(url_text)
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
        tables = [row[0] for row in connection.execute(text("SHOW TABLES"))]
    print("\nSAB THEEK HAI. MySQL connect ho gaya.")
    print("Tables:", tables)
except Exception as exc:
    message = str(exc)
    print("\nCONNECT NAHI HUA.")
    if "1045" in message:
        print("Wajah: MySQL password galat hai.")
        print("Workbench jis password se khulta hai wahi .env mein likho.")
        print("Password mein @ ho toh %40, # ho toh %23 likho.")
    elif "1049" in message:
        print("Wajah: is naam ka database nahi bana hai:", url.database)
        print("Workbench mein SHOW DATABASES; chalake sahi naam dekho.")
    elif "2003" in message or "10061" in message:
        print("Wajah: MySQL server chal hi nahi raha.")
        print("Windows mein Services kholo aur MySQL80 ko Start karo.")
    else:
        print("Error:", message.splitlines()[0])
