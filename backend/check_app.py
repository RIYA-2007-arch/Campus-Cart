import os
import traceback

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_SRC = os.path.join(os.path.dirname(BASE_DIR), "frontend", "src")

print("=== 1) BACKEND FILE ===")
try:
    from app import app, db, init_tables
    print("app.py load ho gaya: OK")
except Exception:
    print("app.py load NAHI hua. Neeche error hai, ye bhej do:")
    traceback.print_exc()
    raise SystemExit

print("\n=== 2) BACKEND ROUTES ===")
routes = {rule.rule for rule in app.url_map.iter_rules()}
required = {
    "/api/products/<int:product_id>/detail": "IMAGE UPLOADS AND PRODUCT DETAIL wala hissa (pichhle step ka pehla block)",
    "/api/uploads/image": "IMAGE UPLOADS AND PRODUCT DETAIL wala hissa (pichhle step ka pehla block)",
    "/api/market": "MARKET FILTERS AND CARTMATE SMART ASSISTANT wala hissa (naya block)",
    "/api/assistant": "MARKET FILTERS AND CARTMATE SMART ASSISTANT wala hissa (naya block)",
}
for rule, block in required.items():
    print(("OK      " if rule in routes else "MISSING ") + rule + ("" if rule in routes else "  ->  jodna hai: " + block))

print("\n=== 3) DATABASE ===")
with app.app_context():
    try:
        init_tables()
        total = db.session.execute(db.text("SELECT COUNT(*) FROM products")).scalar()
        demo = db.session.execute(db.text("SELECT COUNT(*) FROM products WHERE description LIKE '%[demo]%'")).scalar()
        print(f"Total products: {total} | Demo products: {demo}")
        if demo == 0:
            print("Demo products nahi hain -> backend folder mein ye chalao:  py seed_demo.py")
        rows = db.session.execute(db.text("SELECT category, COUNT(*) FROM products GROUP BY category")).fetchall()
        for category, count in rows:
            print(f"  {category}: {count}")
        first = db.session.execute(db.text("SELECT product_id FROM products ORDER BY product_id LIMIT 1")).scalar()
    except Exception as exc:
        first = None
        print("Database check fail:", str(exc).splitlines()[0])

print("\n=== 4) API TEST ===")
client = app.test_client()

def show(label, response):
    body = response.get_data(as_text=True)
    print(f"{label} -> {response.status_code} {body[:160]}")

show("/api/market?limit=3", client.get("/api/market?limit=3"))
if first:
    show(f"/api/products/{first}/detail", client.get(f"/api/products/{first}/detail"))
show("/api/assistant (calculator under 500)", client.post("/api/assistant", json={"message": "calculator under 500"}))

print("\n=== 5) FRONTEND FILES ===")
needed_files = [
    "api.js", "AuthContext.jsx", "categoryIcons.js", "App.jsx", "app-shell.css",
    "components/AppShell.jsx", "components/AuthModals.jsx", "components/ChatPanel.jsx",
    "components/ChatWidget.jsx", "components/ProductCard.jsx",
    "pages/Welcome.jsx", "pages/Home.jsx", "pages/Browse.jsx", "pages/Categories.jsx",
    "pages/Wishlist.jsx", "pages/Profile.jsx", "pages/Sell.jsx", "pages/ProductDetail.jsx",
]
missing = [name for name in needed_files if not os.path.exists(os.path.join(FRONTEND_SRC, *name.split("/")))]
if missing:
    for name in missing:
        print("MISSING  src/" + name)
else:
    print("Saari frontend files maujood hain: OK")

css_path = os.path.join(FRONTEND_SRC, "app-shell.css")
if os.path.exists(css_path):
    css = open(css_path, encoding="utf-8").read()
    for marker, label in ((".cc-detail", "product detail CSS"), (".cc-hero-banner", "Home/Browse CSS"), (".cc-widget", "chatbot CSS")):
        print(("OK      " if marker in css else "MISSING ") + label + ("" if marker in css else "  ->  app-shell.css ke neeche wala block jodna hai"))

home_path = os.path.join(FRONTEND_SRC, "pages", "Home.jsx")
if os.path.exists(home_path):
    home = open(home_path, encoding="utf-8").read()
    print(("OK      " if "cc-hero-banner" in home else "PURANA  ") + "Home.jsx " + ("naya hai" if "cc-hero-banner" in home else "abhi purana hai -> naya Home.jsx se replace karna hai"))