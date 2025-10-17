import React, { useState } from "react";

function App() {
  const [ASIN, setASIN] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const styles = {
    container: {
      minHeight: "80vh",
      width: "100%",
      backgroundColor: "#f0f7ff",
      padding: "20px",
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: "auto",
    },
    maxWidth: {
      maxWidth: "1400px",
      margin: "0 auto",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#1f2937",
      margin: 0,
    },
    historyBtn: {
      padding: "10px 20px",
      backgroundColor: "#4b5563",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      transition: "background-color 0.3s",
    },
    formContainer: {
      backgroundColor: "white",
      padding: "32px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      marginBottom: "32px",
    },
    label: {
      display: "block",
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#374151",
      marginBottom: "8px",
      textAlign: "left",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "1rem",
      boxSizing: "border-box",
      marginBottom: "16px",
    },
    submitBtn: {
      width: "200px",
      padding: "12px 16px",
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "500",
      transition: "background-color 0.3s",
      display: "block",
      margin: "0 auto",
    },
    error: {
      marginTop: "16px",
      color: "#dc2626",
      fontWeight: "500",
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "80px 0",
    },
    spinner: {
      width: "64px",
      height: "64px",
      border: "4px solid #e5e7eb",
      borderTop: "4px solid #2563eb",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    loadingText: {
      marginTop: "16px",
      color: "#4b5563",
      fontWeight: "500",
    },
    cardsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "24px",
    },
    card: {
      border: "2px solid #d1d5db",
      borderRadius: "12px",
      padding: "24px",
      backgroundColor: "white",
      display: "flex",
      flexDirection: "column",
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: "#2563eb",
      marginBottom: "16px",
      marginTop: 0,
    },
    sectionTitle: {
      fontSize: "0.875rem",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "4px",
      marginTop: "16px",
    },
    sectionContent: {
      fontSize: "0.875rem",
      color: "#1f2937",
      margin: "0 0 16px 0",
      whiteSpace: "pre-wrap",
      lineHeight: "1.6",
    },
    bulletList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    bulletItem: {
      fontSize: "0.875rem",
      color: "#4b5563",
      paddingLeft: "16px",
      borderLeft: "2px solid #60a5fa",
      marginBottom: "8px",
      lineHeight: "1.5",
    },
    price: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: "#16a34a",
      margin: "8px 0",
    },
    keywordsContainer: {
      backgroundColor: "white",
      padding: "40px 24px", 
      borderRadius: "12px",
      border: "2px solid #d1d5db",
      marginTop: "24px",
      minHeight: "80px", 
      overflow: "visible",
    },
    keywordsTitle: {
      fontSize: "0.875rem",
      fontWeight: "600",
      color: "#4b5563",
      marginBottom: "8px",
    },
    keywordTags: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    },
    keywordTag: {
      fontSize: "0.75rem",
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      padding: "6px 12px",
      borderRadius: "4px",
      fontWeight: "500",
    },
    historyItem: {
      backgroundColor: "white",
      padding: "24px",
      borderRadius: "12px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      marginBottom: "24px",
    },
    asinText: {
      fontSize: "0.875rem",
      color: "#6b7280",
      marginBottom: "16px",
      fontWeight: "500",
    },
    emptyState: {
      textAlign: "center",
      color: "#4b5563",
      padding: "80px 0",
      fontSize: "1.1rem",
    },
    emptyDataNotice: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "0.875rem",
      marginTop: "8px",
      border: "1px solid #fde68a",
    },
  };

  const keyframes = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ASIN.trim()) {
      setError("Please enter an ASIN");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:9003/api/amazon-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ASIN }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || "Failed to fetch product data");
      }
    } catch (err) {
      setError("Network or server error: " + err.message);
    }

    setLoading(false);
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch("http://localhost:9003/api/all-history-product-list");
      const data = await response.json();
      setHistory(data.history || []);
      setShowHistory(true);
    } catch (err) {
      setError("Failed to fetch history: " + err.message);
    }
    setLoadingHistory(false);
  };

  const formatPrice = (price) => {
    if (!price) return "";
    const cleaned = price.toString().replace(/[^\d.]/g, "");
    return parseFloat(cleaned).toFixed(2);
  };

  const ProductCard = ({ data, title, isOptimized = false }) => {
    const displayTitle = data?.title || "";
    const displayFeatures = data?.features || "";
    const displayDescription = data?.Description || data?.description || "";
    const displayBulletPoints = data?.bullet_points || [];
    const displayPrice = formatPrice(data?.price);

    const hasNoData =
      !displayTitle &&
      !displayFeatures &&
      !displayDescription &&
      displayBulletPoints.length === 0;

    return (
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>{title}</h3>

        {hasNoData && (
          <div style={styles.emptyDataNotice}>
            No product data available for this ASIN
          </div>
        )}

        <div style={{ flexGrow: 1 }}>
          {displayTitle && (
            <div>
              <p style={styles.sectionTitle}>Title:</p>
              <p style={styles.sectionContent}>{displayTitle}</p>
            </div>
          )}

          {displayDescription && (
            <div>
              <p style={styles.sectionTitle}>Description:</p>
              <p style={styles.sectionContent}>{displayDescription}</p>
            </div>
          )}

          {displayFeatures && !isOptimized && (
            <div>
              <p style={styles.sectionTitle}>Features:</p>
              <p style={styles.sectionContent}>{displayFeatures}</p>
            </div>
          )}

          {displayBulletPoints.length > 0 && (
            <div>
              <p style={styles.sectionTitle}>Bullet Points:</p>
              <ul style={styles.bulletList}>
                {displayBulletPoints.map((point, idx) => (
                  <li key={idx} style={styles.bulletItem}>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {displayPrice && (
            <div>
              <p style={styles.sectionTitle}>Price:</p>
              <p style={styles.price}>₹{displayPrice}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (showHistory) {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <div style={styles.maxWidth}>
          <div style={styles.header}>
            <h1 style={styles.title}>Search History</h1>
            <button
              onClick={() => setShowHistory(false)}
              style={styles.historyBtn}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#374151")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#4b5563")}
            >
              Back to Search
            </button>
          </div>

          {loadingHistory ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
            </div>
          ) : history.length === 0 ? (
            <p style={styles.emptyState}>No history found</p>
          ) : (
            <div>
              {history.map((item, idx) => (
                <div key={idx} style={styles.historyItem}>
                  <p style={styles.asinText}>ASIN: {item.asin}</p>
                  <div style={styles.cardsGrid}>
                    <ProductCard data={item.original} title="Original" />
                    <ProductCard
                      data={item.optimized}
                      title="Optimized"
                      isOptimized={true}
                    />
                  </div>

                  {item.optimized &&
                    item.optimized.keywords &&
                    item.optimized.keywords.length > 0 && (
                      <div style={styles.keywordsContainer}>
                        <p style={styles.keywordsTitle}>Keywords:</p>
                        <div style={styles.keywordTags}>
                          {item.optimized.keywords.map((keyword, kidx) => (
                            <span key={kidx} style={styles.keywordTag}>
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <h1 style={styles.title}>Amazon Product Listing Optimizer</h1>
          <button
            onClick={fetchHistory}
            style={styles.historyBtn}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#374151")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4b5563")}
          >
            View History
          </button>
        </div>

        <div style={styles.formContainer}>
          <div>
            <label htmlFor="asin" style={styles.label}>
              Enter Amazon ASIN
            </label>
            <input
              id="asin"
              type="text"
              value={ASIN}
              onChange={(e) => setASIN(e.target.value.toUpperCase())}
              placeholder="e.g., B08N5WRWNW"
              style={styles.input}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
            />
            <button
              onClick={handleSubmit}
              style={styles.submitBtn}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
            >
              Search
            </button>
          </div>

          {error && <p style={styles.error}>{error}</p>}
        </div>

        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading...</p>
          </div>
        )}

        {result && !loading && (
          <div>
            <div style={styles.cardsGrid}>
              <ProductCard data={result.original} title="Original Listing" />
              <ProductCard
                data={result.optimized}
                title="Optimized Listing"
                isOptimized={true}
              />
            </div>

            {result.optimized &&
              result.optimized.keywords &&
              result.optimized.keywords.length > 0 && (
                <div style={styles.keywordsContainer}>
                  <p style={styles.keywordsTitle}>Keywords:</p>
                  <div style={styles.keywordTags}>
                    {result.optimized.keywords.map((keyword, idx) => (
                      <span key={idx} style={styles.keywordTag}>
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
