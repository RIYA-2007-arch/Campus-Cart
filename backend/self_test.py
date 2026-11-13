import sys
import traceback

try:
    from app import app, db, init_tables, serializer, ADMIN_EMAILS
    from werkzeug.security import generate_password_hash
    from sqlalchemy import text
except Exception:
    print("app.py load nahi hua. Neeche ka error bhejo:")
    traceback.print_exc()
    sys.exit(1)

A_EMAIL = "selftest_a@campuscart.test"
B_EMAIL = "selftest_b@campuscart.test"
PASSWORD = "SelfTest@123"

results = []


def check(label, ok, detail=""):
    results.append(ok)
    print(("PASS  " if ok else "FAIL  ") + label + (f"   [{detail}]" if detail and not ok else ""))


def body(response):
    return response.get_json(silent=True) or {}


def cleanup(ids):
    if not ids:
        return
    marks = ",".join(str(i) for i in ids)
    for sql in (
        f"DELETE FROM cc_wishlists WHERE user_id IN ({marks})",
        f"DELETE FROM cc_chat_messages WHERE sender_id IN ({marks}) OR receiver_id IN ({marks})",
        f"DELETE FROM cc_product_reports WHERE reporter_id IN ({marks})",
        f"DELETE FROM cc_orders WHERE buyer_id IN ({marks}) OR seller_id IN ({marks})",
        f"DELETE FROM cc_handover_otps WHERE buyer_id IN ({marks}) OR seller_id IN ({marks})",
        f"DELETE FROM cc_handover_records WHERE buyer_id IN ({marks}) OR seller_id IN ({marks})",
        f"DELETE FROM products WHERE seller_id IN ({marks})",
    ):
        db.session.execute(text(sql))
    db.session.execute(text(f"DELETE FROM users WHERE user_id IN ({marks})"))
    db.session.commit()


def make_user(email, name):
    db.session.execute(text("""
        INSERT INTO users (full_name, email, password_hash, college, branch, semester, is_verified)
        VALUES (:name, :email, :hash, 'AKS University', 'CSE', 4, 1)
    """), {"name": name, "email": email, "hash": generate_password_hash(PASSWORD)})
    db.session.commit()
    return db.session.execute(text("SELECT user_id FROM users WHERE email = :e"), {"e": email}).scalar()


def auth(user_id, email):
    return {"Authorization": "Bearer " + serializer.dumps({"uid": user_id, "email": email})}


with app.app_context():
    init_tables()
    old = [row[0] for row in db.session.execute(
        text("SELECT user_id FROM users WHERE email IN (:a, :b)"), {"a": A_EMAIL, "b": B_EMAIL})]
    cleanup(old)

    a_id = make_user(A_EMAIL, "Self Test A")
    b_id = make_user(B_EMAIL, "Self Test B")
    a_headers, b_headers = auth(a_id, A_EMAIL), auth(b_id, B_EMAIL)
    client = app.test_client()

    try:
        print("\n--- Login and public pages ---")
        r = client.post("/api/login", json={"email": A_EMAIL, "password": PASSWORD})
        check("Login with correct password", r.status_code == 200 and body(r).get("token"), r.get_data(as_text=True)[:120])
        r = client.post("/api/login", json={"email": A_EMAIL, "password": "wrong-password"})
        check("Login with wrong password is rejected", r.status_code == 401)
        r = client.get("/api/health")
        check("Health", r.status_code == 200 and body(r).get("status") == "healthy")
        r = client.get("/api/categories")
        check("Categories", r.status_code == 200 and len(body(r).get("categories", [])) > 0)
        r = client.get("/api/market?limit=5")
        check("Market (products list)", r.status_code == 200 and body(r).get("total", 0) > 0, r.get_data(as_text=True)[:120])
        r = client.get("/api/catalog?category=Electronics&subcategory=Laptops&limit=50")
        check("Catalog: Electronics > Laptops", r.status_code == 200 and body(r).get("total", 0) > 0, r.get_data(as_text=True)[:120])
        r = client.get("/api/subcategories?category=Electronics")
        check("Sub-categories for Electronics", r.status_code == 200 and len(body(r).get("subcategories", [])) > 0)
        r = client.get("/api/catalog?q=macbook")
        check("Search 'macbook'", r.status_code == 200)

        print("\n--- Seller flow ---")
        r = client.post("/api/products", headers=a_headers, json={
            "title": "SelfTest Calculator", "category": "Calculators", "condition": "Good",
            "price": 100, "original_price": 200, "branch": "CSE", "semester": 4, "description": "self test"})
        product_id = body(r).get("product_id")
        check("Create a listing", r.status_code == 201 and product_id, r.get_data(as_text=True)[:160])
        r = client.post("/api/products", json={"title": "x", "price": 1})
        check("Creating a listing without login is rejected", r.status_code == 401)

        if product_id:
            r = client.get(f"/api/products/{product_id}/detail")
            check("Product detail", r.status_code == 200 and body(r).get("product", {}).get("seller_name"))
            r = client.get(f"/api/products/{product_id}/similar")
            check("Similar ads", r.status_code == 200)
            r = client.get(f"/api/sellers/{a_id}")
            check("Seller profile", r.status_code == 200 and len(body(r).get("items", [])) >= 1)
            r = client.put(f"/api/products/{product_id}", headers=a_headers, json={"price": 90})
            check("Edit price (owner)", r.status_code == 200)
            r = client.put(f"/api/products/{product_id}", headers=b_headers, json={"price": 1})
            check("Edit by another user is blocked", r.status_code == 403)
            r = client.get("/api/my/products", headers=a_headers)
            check("My Ads", r.status_code == 200 and any(i["product_id"] == product_id for i in body(r).get("items", [])))

            print("\n--- Buyer flow ---")
            r = client.post("/api/wishlist", headers=b_headers, json={"product_id": product_id})
            check("Add to wishlist", r.status_code == 201)
            r = client.get("/api/wishlist", headers=b_headers)
            check("Wishlist lists it", r.status_code == 200 and any(i["product_id"] == product_id for i in body(r).get("wishlist", [])))
            r = client.delete("/api/wishlist", headers=b_headers, json={"product_id": product_id})
            check("Remove from wishlist", r.status_code == 200)

            r = client.post("/api/chat/messages", headers=b_headers, json={"product_id": product_id, "receiver_id": a_id, "message": "Is this still available?"})
            check("Buyer sends a message", r.status_code == 201, r.get_data(as_text=True)[:120])
            r = client.get(f"/api/chat/conversations", headers=a_headers)
            check("Seller inbox shows the chat", r.status_code == 200 and len(body(r).get("conversations", [])) >= 1)
            r = client.post("/api/chat/messages", headers=a_headers, json={"product_id": product_id, "receiver_id": b_id, "message": "Yes, available."})
            check("Seller replies", r.status_code == 201)
            r = client.get(f"/api/chat/messages?product_id={product_id}&other_id={a_id}", headers=b_headers)
            check("Buyer reads both messages", r.status_code == 200 and len(body(r).get("messages", [])) == 2)

            r = client.post("/api/reports", headers=b_headers, json={"product_id": product_id, "reason": "other", "details": "self test"})
            check("Report a listing", r.status_code == 201, r.get_data(as_text=True)[:120])

            r = client.post("/api/handover/request", headers=b_headers, json={"product_id": product_id})
            check("Handover OTP request (200 = email sent, 502/503 = email settings)", r.status_code in (200, 502, 503), r.get_data(as_text=True)[:120])
            if r.status_code != 200:
                print("      note: handover OTP mail did not go out, check Gmail settings in .env")
            r = client.post("/api/handover/verify", headers=a_headers, json={"product_id": product_id, "buyer_id": b_id, "otp": "000000"})
            check("Wrong handover OTP is rejected", r.status_code in (400, 404))

            print("\n--- Handover OTP and Orders flow ---")
            r = client.post("/api/orders/create", headers=b_headers, json={"product_id": product_id})
            ord_data = body(r)
            order_id = ord_data.get("order_id")
            otp = ord_data.get("otp")
            check("Buyer creates order & receives 6-digit OTP", r.status_code in (200, 201) and order_id and otp and len(otp) == 6, f"order_id={order_id}, otp={otp}")

            r = client.post("/api/orders/create", headers=a_headers, json={"product_id": product_id})
            check("Seller cannot purchase their own product", r.status_code == 400)

            r = client.get("/api/orders/my-purchases", headers=b_headers)
            purchases = body(r).get("orders", [])
            check("Buyer sees order with OTP in My Purchases", r.status_code == 200 and any(o.get("order_id") == order_id and o.get("otp") == otp for o in purchases))

            r = client.get("/api/orders/my-sales", headers=a_headers)
            sales = body(r).get("sales", [])
            check("Seller sees order in My Sales WITHOUT plain OTP", r.status_code == 200 and any(s.get("order_id") == order_id and not s.get("otp") for s in sales))

            r = client.post("/api/orders/verify-otp", headers=b_headers, json={"order_id": order_id, "otp": otp})
            check("Unauthorized user cannot verify order OTP", r.status_code == 403)

            r = client.post("/api/orders/verify-otp", headers=a_headers, json={"order_id": order_id, "otp": "000000"})
            check("Wrong OTP is rejected with remaining attempts", r.status_code == 400 and "remaining" in r.get_data(as_text=True))

            r = client.post("/api/orders/verify-otp", headers=a_headers, json={"order_id": order_id, "otp": otp})
            check("Seller verifies correct OTP -> Order Completed & Sold", r.status_code == 200 and body(r).get("status") == "completed")

            r = client.post("/api/orders/verify-otp", headers=a_headers, json={"order_id": order_id, "otp": otp})
            check("Duplicate verification rejected", r.status_code == 409)

            r = client.get(f"/api/products/{product_id}/detail")
            check("Product status is now marked 'sold'", body(r).get("product", {}).get("status") == "sold")

            r = client.put(f"/api/products/{product_id}", headers=a_headers, json={"status": "sold"})
            check("Mark sold", r.status_code == 200)
            r = client.delete(f"/api/products/{product_id}", headers=a_headers)
            check("Remove listing", r.status_code == 200)

        print("\n--- Chatbot ---")
        r = client.post("/api/cartmate", json={"message": "laptop under 40000"})
        data = body(r)
        check("CartMate: product question returns laptops", r.status_code == 200 and len(data.get("products", [])) > 0, r.get_data(as_text=True)[:140])
        print(f"      mode={data.get('mode')} provider={data.get('provider') or '-'} reply={str(data.get('reply'))[:90]}")
        r = client.post("/api/cartmate", json={"message": "kaise ho bhai"})
        check("CartMate: small talk works", r.status_code == 200 and body(r).get("reply"))
        r = client.post("/api/cartmate", json={"message": "मुझे किताब चाहिए"})
        check("CartMate: Hindi works", r.status_code == 200 and body(r).get("language") == "hi")

        print("\n--- Admin ---")
        if ADMIN_EMAILS:
            admin_headers = auth(a_id, sorted(ADMIN_EMAILS)[0])
            r = client.get("/api/admin/stats", headers=admin_headers)
            check("Admin stats", r.status_code == 200)
            r = client.get("/api/admin/reports", headers=admin_headers)
            check("Admin reports", r.status_code == 200)
            r = client.get("/api/admin/stats", headers=b_headers)
            check("Normal user cannot open admin stats", r.status_code == 403)
        else:
            print("SKIP  Admin checks (ADMIN_EMAILS is empty in .env)")
    except Exception:
        results.append(False)
        print("FAIL  Test script crashed:")
        traceback.print_exc()
    finally:
        db.session.rollback()
        cleanup([a_id, b_id])
        print("\n(test users and their data were deleted)")

passed, failed = sum(1 for ok in results if ok), sum(1 for ok in results if not ok)
print(f"\nRESULT: {passed} passed, {failed} failed")
sys.exit(1 if failed else 0)