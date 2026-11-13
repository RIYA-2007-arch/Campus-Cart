import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";

const CONDITIONS = ["New", "Like New", "Very Good", "Good", "Fair"];
const BRANCHES = ["CSE", "AI & ML", "IT", "ECE", "Mechanical", "Other"];
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_MB = 3;

const MEETUP_SPOTS = [
  "Central Library Lawn (AKS University)",
  "Engineering Block-B Main Gate",
  "Campus Central Canteen / Cafeteria",
  "Hostel Block-1 Entrance Gate",
  "Administrative Block Fountain",
  "Sports Ground Pavilion",
];

export default function Sell() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    condition: "Good",
    original_price: "",
    price: "",
    meetup_spot: MEETUP_SPOTS[0],
    branch: user?.branch || "",
    semester: user?.semester ? String(user.semester) : "",
    subject: "",
    author: "",
    edition: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [priceTip, setPriceTip] = useState("");
  const [suggestingPrice, setSuggestingPrice] = useState(false);

  useEffect(() => {
    api.get("/categories")
      .then((response) => {
        const list = response.data.categories || [];
        setCategories(list);
        setForm((previous) => (
          previous.category || list.length === 0
            ? previous
            : { ...previous, category: list[0].category_name }
        ));
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const update = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleSuggestPrice = async () => {
    if (!form.original_price || Number(form.original_price) <= 0) {
      setPriceTip("Please enter the Original Price (₹) first to calculate fair resale value.");
      return;
    }

    setSuggestingPrice(true);
    setPriceTip("");

    try {
      const res = await api.post("/price-suggestion", {
        title: form.title || "Item",
        category: form.category || "General",
        condition: form.condition || "Good",
        original_price: Number(form.original_price),
      });

      if (res.data?.suggested_price) {
        setForm((prev) => ({ ...prev, price: String(res.data.suggested_price) }));
        setPriceTip(`💡 Recommended campus price: ₹${res.data.suggested_price} (${res.data.condition} condition)`);
      }
    } catch {
      // Local fallback calculation based on student discount model
      const orig = Number(form.original_price);
      const rates = { "New": 0.60, "Like New": 0.45, "Very Good": 0.38, "Good": 0.30, "Fair": 0.20 };
      const rate = rates[form.condition] || 0.30;
      const suggested = Math.round(orig * rate);
      setForm((prev) => ({ ...prev, price: String(suggested) }));
      setPriceTip(`💡 Recommended campus price: ₹${suggested} (~${Math.round((1 - rate) * 100)}% off retail)`);
    } finally {
      setSuggestingPrice(false);
    }
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!IMAGE_TYPES.includes(file.type)) {
      setError("Please choose a JPG, PNG or WEBP image.");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(`The image must be smaller than ${MAX_IMAGE_MB} MB.`);
      return;
    }

    setError("");
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const price = Number(form.price);
    if (!form.title.trim()) {
      setError("Please enter the product title.");
      return;
    }
    if (form.price === "" || !Number.isFinite(price) || price < 0) {
      setError("Please enter a valid selling price.");
      return;
    }
    if (!form.category) {
      setError("Please choose a category.");
      return;
    }

    setSaving(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        const data = new FormData();
        data.append("image", imageFile);
        const upload = await api.post("/uploads/image", data);
        imageUrl = upload.data.image_url;
      }

      // Append preferred meetup spot to description so it seamlessly displays everywhere
      let fullDesc = form.description.trim();
      if (form.meetup_spot) {
        fullDesc = fullDesc ? `${fullDesc}\n\n📍 Preferred Campus Meetup: ${form.meetup_spot}` : `📍 Preferred Campus Meetup: ${form.meetup_spot}`;
      }

      const response = await api.post("/products", {
        title: form.title.trim(),
        category: form.category,
        condition: form.condition,
        price,
        original_price: form.original_price ? Number(form.original_price) : undefined,
        branch: form.branch || undefined,
        semester: form.semester ? Number(form.semester) : undefined,
        subject: form.subject.trim() || undefined,
        author: form.author.trim() || undefined,
        edition: form.edition.trim() || undefined,
        description: fullDesc || undefined,
        image_url: imageUrl || undefined,
      });

      navigate(`/product/${response.data.product_id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not list your product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const isBook = /book/i.test(form.category);

  return (
    <div>
      <h1 className="cc-page-title">Sell a Product</h1>
      <p className="cc-page-subtitle">List something for students on your campus.</p>

      <form className="cc-form" onSubmit={handleSubmit}>
        {error && <p className="cc-alert error" role="alert">{error}</p>}

        <div className="cc-field">
          <label htmlFor="sell-title">Product title *</label>
          <input id="sell-title" type="text" value={form.title} onChange={update("title")} placeholder="e.g. Casio fx-991EX Calculator / DBMS by Korth" maxLength={150} required />
        </div>

        <div className="cc-form-grid">
          <div className="cc-field">
            <label htmlFor="sell-category">Category *</label>
            <select id="sell-category" value={form.category} onChange={update("category")} required>
              {categories.length === 0 && <option value="">Loading categories...</option>}
              {categories.map((item) => (
                <option key={item.category_id} value={item.category_name}>{item.category_name}</option>
              ))}
            </select>
          </div>

          <div className="cc-field">
            <label htmlFor="sell-condition">Condition *</label>
            <select id="sell-condition" value={form.condition} onChange={update("condition")}>
              {CONDITIONS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>

        {/* Pricing with Smart Student Price Assistant */}
        <div className="cc-form-grid">
          <div className="cc-field">
            <label htmlFor="sell-original">Original Retail Price (₹)</label>
            <input id="sell-original" type="number" min="0" value={form.original_price} onChange={update("original_price")} placeholder="What it cost new (MRP)" />
          </div>

          <div className="cc-field">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label htmlFor="sell-price">Your Selling Price (₹) *</label>
              <button
                type="button"
                onClick={handleSuggestPrice}
                disabled={suggestingPrice}
                style={{
                  background: "none",
                  border: "none",
                  color: "#D97706",
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: 0,
                  marginBottom: "4px",
                }}
              >
                {suggestingPrice ? "Calculating..." : "✨ Suggest Fair Price"}
              </button>
            </div>
            <input id="sell-price" type="number" min="0" value={form.price} onChange={update("price")} placeholder="Resale price you want" required />
          </div>
        </div>

        {priceTip && (
          <div style={{
            background: "#FEF3C7",
            border: "1px solid #FCD34D",
            color: "#92400E",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "600",
            marginBottom: "16px",
          }}>
            {priceTip}
          </div>
        )}

        {/* Safe Campus Meetup Spot */}
        <div className="cc-field">
          <label htmlFor="sell-meetup">📍 Campus Safe Meetup Spot *</label>
          <select id="sell-meetup" value={form.meetup_spot} onChange={update("meetup_spot")} required>
            {MEETUP_SPOTS.map((spot) => (
              <option key={spot} value={spot}>{spot}</option>
            ))}
          </select>
          <small style={{ color: "#71717A", fontSize: "11px", marginTop: "4px", display: "block" }}>
            Designated safe zones with CCTV and faculty/student presence at AKS University.
          </small>
        </div>

        <div className="cc-form-grid">
          <div className="cc-field">
            <label htmlFor="sell-branch">Branch</label>
            <select id="sell-branch" value={form.branch} onChange={update("branch")}>
              <option value="">Not specific</option>
              {BRANCHES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div className="cc-field">
            <label htmlFor="sell-semester">Semester</label>
            <select id="sell-semester" value={form.semester} onChange={update("semester")}>
              <option value="">Not specific</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <option key={item} value={String(item)}>Semester {item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="cc-field">
          <label htmlFor="sell-subject">Subject (optional)</label>
          <input id="sell-subject" type="text" value={form.subject} onChange={update("subject")} placeholder="e.g. Database Management Systems" maxLength={100} />
        </div>

        {isBook && (
          <div className="cc-form-grid">
            <div className="cc-field">
              <label htmlFor="sell-author">Author</label>
              <input id="sell-author" type="text" value={form.author} onChange={update("author")} maxLength={150} />
            </div>
            <div className="cc-field">
              <label htmlFor="sell-edition">Edition</label>
              <input id="sell-edition" type="text" value={form.edition} onChange={update("edition")} placeholder="e.g. 2nd Edition" maxLength={50} />
            </div>
          </div>
        )}

        <div className="cc-field">
          <label htmlFor="sell-description">Description</label>
          <textarea id="sell-description" rows={4} value={form.description} onChange={update("description")} placeholder="Condition details, what is included, working status..." />
        </div>

        <div className="cc-field">
          <label htmlFor="sell-image">Photo (JPG, PNG or WEBP, up to {MAX_IMAGE_MB} MB)</label>
          <input id="sell-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} />
          {preview && <img className="cc-preview" src={preview} alt="Selected product preview" />}
        </div>

        <button type="submit" className="cc-btn wide" disabled={saving}>
          {saving ? "Listing..." : "List Product"}
        </button>
      </form>
    </div>
  );
}
