import { useEffect, useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load existing signatures from the server
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/signatures");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setSignatures(data);
      } catch (e) {
        console.error(e);
        setError("Could not load existing messages.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !message.trim()) {
      setError("Please enter both your name and a message.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/signatures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim() })
      });
      if (!res.ok) throw new Error("Failed to save");
      const saved = await res.json();
      setSignatures((prev) => [...prev, saved]);
      setName("");
      setMessage("");
    } catch (e) {
      console.error(e);
      setError("Something went wrong saving your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div style={{ background: "#f2f2f2", minHeight: "100vh", padding: "20px" }}>
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        {/* Card image from /public */}
        <img
          src="/ecard.jpg"
          alt="Thank you card"
          style={{ width: "100%", borderRadius: "6px", marginBottom: "20px" }}
        />

        <h2 style={{ textAlign: "center", marginTop: 0 }}>Add Your Message</h2>

        <form onSubmit={handleSubmit}>
          <label style={{ fontWeight: "bold", display: "block", marginTop: "10px" }}>
            Name
          </label>
          <input
            type="text"
            value={name}
            placeholder="Your name"
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              margin: "5px 0 10px",
              boxSizing: "border-box",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />

          <label style={{ fontWeight: "bold", display: "block", marginTop: "10px" }}>
            Message
          </label>
          <textarea
            rows={3}
            value={message}
            placeholder="Write a short message"
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              margin: "5px 0 10px",
              boxSizing: "border-box",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />

          {error && (
            <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              border: "none",
              borderRadius: "4px",
              background: "#333",
              color: "white"
            }}
          >
            {submitting ? "Saving..." : "Add to Card"}
          </button>
        </form>

        <hr style={{ margin: "20px 0" }} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px"
          }}
        >
          <h3 style={{ margin: 0 }}>Messages</h3>
          <button
            type="button"
            onClick={handlePrint}
            style={{
              padding: "6px 12px",
              fontSize: "14px",
              cursor: "pointer",
              border: "none",
              borderRadius: "4px",
              background: "#555",
              color: "white"
            }}
          >
            Print / Save as PDF
          </button>
        </div>

        {loading ? (
          <p>Loading messages…</p>
        ) : signatures.length === 0 ? (
          <p>No messages yet. Be the first to sign!</p>
        ) : (
          <div id="signatures">
            {signatures.map((sig, i) => (
              <div
                key={i}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "10px 0"
                }}
              >
                <strong>{sig.name}</strong>
                <br />
                {sig.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
