import traceback

try:
    from app import app, init_tables
except Exception:
    print("APP LOAD NAHI HUA, file mein error hai:")
    traceback.print_exc()
    raise SystemExit

with app.app_context():
    try:
        init_tables()
        print("1) Tables ready: OK")
    except Exception as exc:
        print("1) Tables: FAIL ->", str(exc).splitlines()[0])

client = app.test_client()
for path in ("/api/health", "/api/products", "/api/categories"):
    response = client.get(path)
    print(path, "->", response.status_code, response.get_data(as_text=True)[:300])