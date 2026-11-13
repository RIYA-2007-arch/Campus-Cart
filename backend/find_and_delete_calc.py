"""
Run this script while backend (MySQL) is running to find & delete the wrong Casio calculator product.
Usage: python find_and_delete_calc.py
"""
import pymysql

conn = pymysql.connect(
    host="localhost",
    user="root",
    password="CampusCart@123",
    database="campuscart",
    charset="utf8mb4",
)
cursor = conn.cursor()

print("\n=== Searching for Casio/Calculator/Bulb/Painting products ===\n")
cursor.execute("""
    SELECT p.product_id, p.product_name, p.seller_id, u.name as seller_name, p.image_url, p.created_at
    FROM products p
    LEFT JOIN users u ON u.user_id = p.seller_id
    WHERE LOWER(p.product_name) LIKE '%casio%'
       OR LOWER(p.product_name) LIKE '%calculator%'
       OR LOWER(p.product_name) LIKE '%bulb%'
       OR LOWER(p.product_name) LIKE '%painting%'
       OR LOWER(p.image_url) LIKE '%bulb%'
    ORDER BY p.created_at DESC
    LIMIT 20
""")
rows = cursor.fetchall()

if not rows:
    print("No matching products found.")
else:
    for r in rows:
        print(f"  ID: {r[0]} | Name: {r[1]} | Seller: {r[3]} (id={r[2]}) | Image: {r[4]} | Date: {r[5]}")

print(f"\nTotal found: {len(rows)}")

if rows:
    ids_to_delete = [r[0] for r in rows]
    print(f"\nProduct IDs to delete: {ids_to_delete}")
    confirm = input("\nType 'yes' to DELETE ALL these products: ").strip().lower()
    if confirm == "yes":
        for pid in ids_to_delete:
            cursor.execute("DELETE FROM cc_wishlists WHERE product_id = %s", (pid,))
            cursor.execute("DELETE FROM products WHERE product_id = %s", (pid,))
        conn.commit()
        print(f"\n✅ Deleted {len(ids_to_delete)} product(s) successfully!")
    else:
        print("Cancelled. No products deleted.")

cursor.close()
conn.close()
