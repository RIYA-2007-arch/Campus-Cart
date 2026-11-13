from flask import jsonify, request

# Sub-categories are matched by words in the product title, like OLX search.
# A rule is a list of words, or (words, words_to_exclude).
SUBCATEGORIES = {
    "electronic": {
        "Laptops": (["laptop"], ["laptop ram", "laptop charger", "laptop bag"]),
        "Desktops": (["desktop", "all-in-one"], ["desktop ram", "printer"]),
        "Tablets": (["tablet", "ipad"], []),
        "Mobile Phones": (["mobile phone", "iphone", "smartphone"], []),
        "Monitors": (["monitor"], ["desktop"]),
        "Keyboards": (["keyboard"], ["desktop"]),
        "Mouse": (["mouse"], ["desktop"]),
        "Headphones": (["headphone"], []),
        "Earphones": (["earphone", "neckband", "buds"], []),
        "SSDs": (["ssd"], ["laptop (", "desktop"]),
        "RAM": (["ddr"], []),
        "Hard Drives": (["hard drive", "hdd"], ["desktop"]),
        "USB Drives": (["pen drive", "usb flash", "usb drive"], []),
        "Chargers": (["charger", "adapter"], []),
        "Power Banks": (["power bank"], []),
        "Printers": (["printer"], []),
        "Webcams": (["webcam"], []),
        "Routers": (["router"], []),
        "Speakers": (["speaker"], []),
    },
    "book": {
        "DSA": (["data structures", "algorithm"], []),
        "DBMS": (["database", "dbms"], []),
        "Python": (["python"], []),
        "Java": (["java"], []),
        "AI and ML": (["artificial intelligence", "machine learning", "deep learning", "pattern recognition"], []),
        "Operating Systems": (["operating system"], []),
        "Computer Networks": (["computer networks", "data communications"], []),
        "Maths and Science": (["mathematics", "physics", "chemistry"], []),
    },
    "study": {
        "Semester Notes": (["notes"], []),
        "Practical Files": (["practical file", "lab manual"], []),
        "Previous Year Papers": (["previous year", "pyq"], []),
        "Placement Prep": (["placement"], []),
    },
    "college": {
        "Stationery": (["stationery", "geometry", "drawing board", "record files"], []),
        "Drawing Kits": (["drafter", "drawing kit"], []),
        "Bags": (["backpack", "bag"], []),
        "Lab Coats": (["lab coat"], []),
        "Arduino and Boards": (["arduino", "esp32", "esp8266", "raspberry"], []),
        "Sensors and Modules": (["sensor", "relay", "lcd", "motor", "breadboard"], []),
        "Tools": (["soldering", "multimeter"], []),
    },
    "sport": {
        "Badminton": (["badminton", "shuttlecock"], []),
        "Cricket": (["cricket"], []),
        "Football": (["football"], []),
        "Bicycles": (["bicycle", "bike"], []),
        "Sports Shoes": (["shoes"], []),
        "Yoga and Fitness": (["yoga", "dumbbell", "resistance", "gym", "skipping", "push-up", "shaker"], []),
    },
    "hostel": {
        "Appliances": (["fridge", "fan", "heater", "cooler", "iron"], []),
        "Kitchen": (["kettle", "induction", "lunch", "bucket"], []),
        "Furniture": (["table", "chair", "bookshelf", "cabinet"], ["lamp"]),
        "Bedding": (["mattress", "pillow", "bedsheet", "blanket"], []),
        "Lighting": (["lamp"], []),
    },
    "other": {
        "Arduino and Boards": (["arduino", "esp32", "esp8266", "raspberry"], []),
        "Sensors and Modules": (["sensor", "relay", "lcd", "motor", "breadboard"], []),
        "Tools": (["soldering", "multimeter"], []),
        "Music": (["guitar", "ukulele"], []),
        "Games": (["chess", "carrom", "ludo"], []),
        "Daily Use": (["umbrella", "bottle", "jacket", "hoodie"], []),
    },
}


def register_more(app, db, ns):
    error = ns["error"]
    get_columns = ns["get_columns"]
    product_pk = ns["product_pk"]
    shape_product = ns["shape_product"]
    category_names = ns["category_names"]
    build_product_filters = ns["build_product_filters"]

    def subcategory_map(category):
        key = str(category or "").lower()
        for keyword, mapping in SUBCATEGORIES.items():
            if keyword in key:
                return mapping
        return {}

    def name_column():
        columns = get_columns("products")
        return next((c for c in ("product_name", "title", "name") if c in columns), "product_name")

    def words_clause(rule, column):
        include, exclude = rule
        parts, params = [], {}
        for index, word in enumerate(include):
            key = f"sub{index}"
            parts.append(f"LOWER(`{column}`) LIKE :{key}")
            params[key] = f"%{word}%"
        clause = "(" + " OR ".join(parts) + ")"
        for index, word in enumerate(exclude):
            key = f"not{index}"
            clause += f" AND LOWER(`{column}`) NOT LIKE :{key}"
            params[key] = f"%{word}%"
        return "(" + clause + ")", params

    @app.route("/api/subcategories", methods=["GET"])
    def subcategories():
        try:
            category = request.args.get("category", "").strip()
            mapping = subcategory_map(category)
            if not mapping:
                return jsonify({"success": True, "subcategories": []})

            where, params, _columns, _categories = build_product_filters({"category": category})
            if where is None:
                return jsonify({"success": True, "subcategories": []})

            column = name_column()
            result = []
            for label, rule in mapping.items():
                curr_where = where
                if "college" in category.lower() and label in ("Arduino and Boards", "Sensors and Modules", "Tools"):
                    curr_where = curr_where.replace("AND LOWER(category) = :category", "AND (LOWER(category) = :category OR LOWER(category) = 'other')")
                    other_id = next((cid for cid, cname in _categories.items() if "other" in str(cname).lower()), None)
                    if other_id is not None:
                        curr_where = curr_where.replace("AND category_id = :category_id", f"AND category_id IN (:category_id, {other_id})")
                clause, extra = words_clause(rule, column)
                count = db.session.execute(
                    db.text("SELECT COUNT(*) FROM products" + curr_where + " AND " + clause),
                    {**params, **extra},
                ).scalar() or 0
                result.append({"name": label, "count": count})
            return jsonify({"success": True, "subcategories": result})
        except Exception:
            db.session.rollback()
            app.logger.exception("Subcategories failed")
            return error("Unable to load sub-categories.", 500)

    @app.route("/api/catalog", methods=["GET"])
    def catalog():
        try:
            args = request.args
            page = max(args.get("page", 1, type=int) or 1, 1)
            limit = min(max(args.get("limit", 24, type=int) or 24, 1), 100)

            where, params, columns, categories = build_product_filters(args)
            if where is None:
                return jsonify({"success": True, "total": 0, "items": []})

            sub = args.get("subcategory", "").strip()
            rule = subcategory_map(args.get("category", "")).get(sub) if sub else None
            if sub and "college" in str(args.get("category", "")).lower() and sub in ("Arduino and Boards", "Sensors and Modules", "Tools"):
                where = where.replace("AND LOWER(category) = :category", "AND (LOWER(category) = :category OR LOWER(category) = 'other')")
                other_id = next((cid for cid, cname in categories.items() if "other" in str(cname).lower()), None)
                if other_id is not None:
                    where = where.replace("AND category_id = :category_id", f"AND category_id IN (:category_id, {other_id})")
            if rule:
                clause, extra = words_clause(rule, name_column())
                where += " AND " + clause
                params.update(extra)

            orders = {"price_asc": "price ASC", "price_desc": "price DESC"}
            order = orders.get(args.get("sort", "newest")) or ("created_at DESC" if "created_at" in columns else "1")

            total = db.session.execute(db.text("SELECT COUNT(*) FROM products" + where), params).scalar() or 0
            rows = db.session.execute(
                db.text(f"SELECT * FROM products{where} ORDER BY {order} LIMIT :limit OFFSET :offset"),
                {**params, "limit": limit, "offset": (page - 1) * limit},
            ).mappings().all()
            is_unwanted = globals().get("is_unwanted_item") or (lambda x: False)
            items = [shape_product(r, categories) for r in rows if not is_unwanted(r)]
            return jsonify({"success": True, "total": len(items), "items": items})
        except Exception:
            db.session.rollback()
            app.logger.exception("Catalog failed")
            return error("Unable to load products.", 500)

    @app.route("/api/products/<int:product_id>/similar", methods=["GET"])
    def similar_products(product_id):
        try:
            pk = product_pk()
            row = db.session.execute(
                db.text(f"SELECT * FROM products WHERE `{pk}` = :pid LIMIT 1"), {"pid": product_id}
            ).mappings().first()
            if not row:
                return error("Product not found.", 404)

            where, params, _columns, categories = build_product_filters({"category": row.get("category") or ""})
            if where is None:
                return jsonify({"success": True, "items": []})

            where += f" AND `{pk}` <> :me"
            params.update({"me": product_id, "price": float(row.get("price") or 0)})
            rows = db.session.execute(
                db.text(f"SELECT * FROM products{where} ORDER BY ABS(price - :price) ASC LIMIT 8"), params
            ).mappings().all()
            return jsonify({"success": True, "items": [shape_product(r, categories) for r in rows]})
        except Exception:
            db.session.rollback()
            app.logger.exception("Similar products failed")
            return error("Unable to load similar products.", 500)

    @app.route("/api/sellers/<int:seller_id>", methods=["GET"])
    def seller_profile(seller_id):
        try:
            user_columns = get_columns("users")
            user_pk = "user_id" if "user_id" in user_columns else "id"
            user = db.session.execute(
                db.text(f"SELECT * FROM users WHERE `{user_pk}` = :id LIMIT 1"), {"id": seller_id}
            ).mappings().first()
            if not user:
                return error("Seller not found.", 404)

            where, params, columns, categories = build_product_filters({})
            where += " AND seller_id = :seller"
            params["seller"] = seller_id
            order = "created_at DESC" if "created_at" in columns else "1"
            rows = db.session.execute(
                db.text(f"SELECT * FROM products{where} ORDER BY {order} LIMIT 48"), params
            ).mappings().all()

            created = user.get("created_at")
            return jsonify({
                "success": True,
                "seller": {
                    "user_id": seller_id,
                    "full_name": user.get("full_name") or user.get("name") or "Student",
                    "college": user.get("college") or user.get("university") or "",
                    "branch": user.get("branch") or "",
                    "semester": user.get("semester") or "",
                    "member_since": created.isoformat() if created else None,
                },
                "items": [shape_product(r, categories) for r in rows],
            })
        except Exception:
            db.session.rollback()
            app.logger.exception("Seller profile failed")
            return error("Unable to load the seller.", 500)

    from cartmate import register_cartmate

    register_cartmate(app, db, ns)