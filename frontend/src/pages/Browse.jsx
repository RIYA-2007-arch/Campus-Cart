import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";

const CONDITIONS = ["New", "Like New", "Very Good", "Good", "Fair"];
const BRANCHES = ["CSE", "AI & ML", "IT", "ECE", "Mechanical", "Other"];
const PAGE_SIZE = 24;

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const queryKey = params.toString();

  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const subcategory = params.get("subcategory") || "";
  const branch = params.get("branch") || "";
  const semester = params.get("semester") || "";
  const sort = params.get("sort") || "newest";
  const conditions = (params.get("condition") || "").split(",").filter(Boolean);

  const [categories, setCategories] = useState([]);
  const [subs, setSubs] = useState([]);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceMin, setPriceMin] = useState(params.get("min_price") || "");
  const [priceMax, setPriceMax] = useState(params.get("max_price") || "");

  useEffect(() => {
    api.get("/categories")
      .then((response) => setCategories(response.data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!category) {
      setSubs([]);
      return;
    }
    api.get("/subcategories", { params: { category } })
      .then((response) => setSubs(response.data.subcategories || []))
      .catch(() => setSubs([]));
  }, [category]);

  useEffect(() => {
    setPriceMin(params.get("min_price") || "");
    setPriceMax(params.get("max_price") || "");
    let cancelled = false;
    setLoading(true);
    setPage(1);

    api.get("/catalog", { params: { ...Object.fromEntries(params.entries()), page: 1, limit: PAGE_SIZE } })
      .then((response) => {
        if (cancelled) return;
        setItems(response.data.items || []);
        setTotal(response.data.total || 0);
        setError("");
      })
      .catch(() => {
        if (!cancelled) setError("Products could not be loaded. Please check that the backend is running.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const changeCategory = (value) => {
    const next = new URLSearchParams(params);
    next.delete("subcategory");
    if (value) next.set("category", value);
    else next.delete("category");
    setParams(next);
  };

  const toggleCondition = (name) => {
    const set = new Set(conditions);
    if (set.has(name)) set.delete(name);
    else set.add(name);
    setParam("condition", [...set].join(","));
  };

  const applyPrice = () => {
    const next = new URLSearchParams(params);
    if (priceMin) next.set("min_price", priceMin);
    else next.delete("min_price");
    if (priceMax) next.set("max_price", priceMax);
    else next.delete("max_price");
    setParams(next);
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const response = await api.get("/catalog", {
        params: { ...Object.fromEntries(params.entries()), page: nextPage, limit: PAGE_SIZE },
      });
      setItems((previous) => [...previous, ...(response.data.items || [])]);
      setPage(nextPage);
    } catch {
      setError("Could not load more products.");
    } finally {
      setLoadingMore(false);
    }
  };

  const hasFilters = [...params.keys()].length > 0;
  const title = q ? `Results for “${q}”` : subcategory || category || "All Products";

  return (
    <div>
      <h1 className="cc-page-title">{title}</h1>
      <p className="cc-page-subtitle">{loading ? "Searching..." : `${total} ad${total === 1 ? "" : "s"} found`}</p>

      {subs.length > 0 && (
        <div className="cc-chips">
          <button type="button" className={`cc-chip ${!subcategory ? "active" : ""}`} onClick={() => setParam("subcategory", "")}>
            All {category}
          </button>
          {subs.map((item) => (
            <button
              type="button"
              key={item.name}
              className={`cc-chip ${subcategory === item.name ? "active" : ""}`}
              onClick={() => setParam("subcategory", item.name)}
            >
              {item.name} ({item.count})
            </button>
          ))}
        </div>
      )}

      <button type="button" className="cc-btn secondary cc-filter-toggle" onClick={() => setShowFilters((open) => !open)}>
        {showFilters ? "Hide filters" : "Filters & sort"}
      </button>

      <div className="cc-browse">
        <aside className={`cc-filters ${showFilters ? "open" : ""}`}>
          <div className="cc-filter-block">
            <h4>Sort by</h4>
            <select value={sort} onChange={(event) => setParam("sort", event.target.value === "newest" ? "" : event.target.value)}>
              <option value="newest">Newest first</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
          </div>

          <div className="cc-filter-block">
            <h4>Category</h4>
            <select value={category} onChange={(event) => changeCategory(event.target.value)}>
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item.category_id} value={item.category_name}>{item.category_name}</option>
              ))}
            </select>
          </div>

          <div className="cc-filter-block">
            <h4>Price (₹)</h4>
            <div className="cc-price-inputs">
              <input type="number" min="0" placeholder="Min" value={priceMin} onChange={(event) => setPriceMin(event.target.value)} />
              <input type="number" min="0" placeholder="Max" value={priceMax} onChange={(event) => setPriceMax(event.target.value)} />
            </div>
            <button type="button" className="cc-btn secondary small" onClick={applyPrice}>Apply</button>
          </div>

          <div className="cc-filter-block">
            <h4>Condition</h4>
            {CONDITIONS.map((name) => (
              <label key={name} className="cc-check">
                <input type="checkbox" checked={conditions.includes(name.toLowerCase())} onChange={() => toggleCondition(name.toLowerCase())} />
                {name}
              </label>
            ))}
          </div>

          <div className="cc-filter-block">
            <h4>Branch</h4>
            <select value={branch} onChange={(event) => setParam("branch", event.target.value)}>
              <option value="">Any branch</option>
              {BRANCHES.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>

          <div className="cc-filter-block">
            <h4>Semester</h4>
            <select value={semester} onChange={(event) => setParam("semester", event.target.value)}>
              <option value="">Any semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={String(n)}>Semester {n}</option>)}
            </select>
          </div>

          {hasFilters && (
            <button type="button" className="cc-btn ghost small" onClick={() => setParams({})}>Clear all</button>
          )}
        </aside>

        <section className="cc-results">
          {loading ? (
            <p className="cc-empty">Loading products...</p>
          ) : error ? (
            <p className="cc-empty">{error}</p>
          ) : items.length === 0 ? (
            <p className="cc-empty">No ads match these filters. Try removing a filter.</p>
          ) : (
            <>
              <div className="cc-grid">
                {items.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
              {items.length < total && (
                <div className="cc-more">
                  <button type="button" className="cc-btn secondary" onClick={loadMore} disabled={loadingMore}>
                    {loadingMore ? "Loading..." : "Load more"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}